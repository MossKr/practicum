/// <reference types="cypress" />

import orderReducer, {
  createOrder,
  clearOrder,
  selectOrderNumber,
  selectOrderStatus,
  selectOrderError,
} from './orderSlice';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import api from '../../api/api';
import { RootState } from '../store';
import { OrderResponse, LoadingState } from '../../utils/typesTs';

interface OrderState {
  orderNumber: number | null;
  status: LoadingState;
  error: string | null;
}

type TestRootState = {
  order: OrderState;
};

describe('orderSlice', () => {
  let store: EnhancedStore<TestRootState>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        order: orderReducer,
      },
    });
  });

  it('should handle initial state', () => {
    const state = store.getState();
    expect(state.order).to.deep.equal({
      orderNumber: null,
      status: 'idle',
      error: null,
    });
  });

  it('should handle clearOrder', () => {
    store.dispatch(createOrder.fulfilled({ success: true, name: 'Test Order', order: { number: 12345 } as any } as OrderResponse, '', []));
    store.dispatch(clearOrder());
    const state = store.getState();
    expect(state.order).to.deep.equal({
      orderNumber: null,
      status: 'idle',
      error: null,
    });
  });

  describe('createOrder', () => {
    it('should handle createOrder.pending', () => {
      store.dispatch(createOrder.pending('', []));
      const state = store.getState();
      expect(state.order.status).to.equal('loading');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(state.order.error).to.be.null;
    });

    it('should handle createOrder.fulfilled', () => {
      const mockOrderResponse: OrderResponse = {
        success: true,
        name: 'Test Order',
        order: { number: 12345 } as any
      };
      store.dispatch(createOrder.fulfilled(mockOrderResponse, '', []));
      const state = store.getState();
      expect(state.order.status).to.equal('succeeded');
      expect(state.order.orderNumber).to.equal(12345);
    });

    it('should handle createOrder.rejected', () => {
      store.dispatch(createOrder.rejected(null, '', [], 'Error message'));
      const state = store.getState();
      expect(state.order.status).to.equal('failed');
      expect(state.order.error).to.equal('Error message');
    });
  });

  describe('async createOrder', () => {
    it('should create order successfully', () => {
      const mockIngredients = ['ingredient1', 'ingredient2'];
      const mockOrderResponse: OrderResponse = {
        success: true,
        name: 'Test Order',
        order: { number: 12345 } as any
      };

      cy.stub(localStorage, 'getItem')
        .withArgs('accessToken')
        .returns('mock-token');

      cy.stub(api, 'createOrder').resolves(mockOrderResponse);

      // @ts-ignore
      return cy.wrap(store.dispatch(createOrder(mockIngredients))).then(() => {
        const state = store.getState();
        expect(state.order.status).to.equal('succeeded');
        expect(state.order.orderNumber).to.equal(12345);
      });
    });

    it('should handle token refresh', () => {
      const mockIngredients = ['ingredient1', 'ingredient2'];
      const mockOrderResponse: OrderResponse = {
        success: true,
        name: 'Test Order',
        order: { number: 12345 } as any
      };
      const mockRefreshResponse = { success: true, accessToken: 'new-token' };

      cy.stub(localStorage, 'getItem')
        .withArgs('accessToken').returns('old-token')
        .withArgs('refreshToken').returns('refresh-token');

      cy.stub(api, 'createOrder')
        .onFirstCall().rejects(new Error('jwt expired'))
        .onSecondCall().resolves(mockOrderResponse);

      cy.stub(api, 'refreshToken').resolves(mockRefreshResponse);

      cy.stub(localStorage, 'setItem');

      // @ts-ignore
      return cy.wrap(store.dispatch(createOrder(mockIngredients))).then(() => {
        expect(localStorage.setItem).to.be.calledWith('accessToken', 'new-token');
        const state = store.getState();
        expect(state.order.status).to.equal('succeeded');
        expect(state.order.orderNumber).to.equal(12345);
      });
    });

    it('should handle api error', () => {
      const mockIngredients = ['ingredient1', 'ingredient2'];

      cy.stub(localStorage, 'getItem')
        .withArgs('accessToken')
        .returns('mock-token');

      cy.stub(api, 'createOrder').rejects(new Error('API Error'));

      // @ts-ignore
      return cy.wrap(store.dispatch(createOrder(mockIngredients))).then(() => {
        const state = store.getState();
        expect(state.order.status).to.equal('failed');
        expect(state.order.error).to.equal('API Error');
      });
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      store.dispatch(createOrder.fulfilled({ success: true, name: 'Test Order', order: { number: 12345 } as any } as OrderResponse, '', []));
    });

    it('should select order number', () => {
      const state = store.getState();
      expect(selectOrderNumber(state as RootState)).to.equal(12345);
    });

    it('should select order status', () => {
      const state = store.getState();
      expect(selectOrderStatus(state as RootState)).to.equal('succeeded');
    });

    it('should select order error', () => {
      store.dispatch(createOrder.rejected(null, '', [], 'Error message'));
      const state = store.getState();
      expect(selectOrderError(state as RootState)).to.equal('Error message');
    });
  });
});
