/// <reference types="cypress" />

import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import profileOrdersReducer, {
  wsConnecting,
  wsConnect,
  wsDisconnect,
  wsError,
  wsMessage,
  wsReconnect,
  wsSendMessage,
  ProfileOrdersState,
  ProfileOrder,
  selectProfileOrders,
  selectProfileOrdersTotal,
  selectProfileOrdersTotalToday,
  selectProfileOrdersConnectionStatus,
  selectProfileOrdersError,
  selectProfileOrderById,
  selectProfileOrdersStatus
} from './profileOrdersSlice';

type MockRootState = {
  profileOrders: ProfileOrdersState;
};

describe('Profile Orders Slice', () => {
  let store: EnhancedStore<MockRootState>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        profileOrders: profileOrdersReducer,
      },
    });
  });

  const mockOrder: ProfileOrder = {
    ingredients: ['ingredient1', 'ingredient2'],
    _id: '1',
    status: 'done',
    number: 1234,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  it('should handle initial state', () => {
    expect(store.getState().profileOrders).to.deep.equal({
      orders: [],
      total: 0,
      totalToday: 0,
      connectionStatus: 'idle',
      error: null
    });
  });

  it('should handle wsConnecting', () => {
    store.dispatch(wsConnecting({ url: 'ws://test.com' }));
    expect(store.getState().profileOrders.connectionStatus).to.equal('connecting');
  });

  it('should handle wsConnect', () => {
    store.dispatch(wsConnect());
    expect(store.getState().profileOrders.connectionStatus).to.equal('connected');
  });

  it('should handle wsDisconnect', () => {
    store.dispatch(wsMessage({
      success: true,
      orders: [mockOrder],
      total: 100,
      totalToday: 10
    }));
    store.dispatch(wsDisconnect());
    expect(store.getState().profileOrders).to.deep.equal({
      orders: [],
      total: 0,
      totalToday: 0,
      connectionStatus: 'disconnected',
      error: null
    });
  });

  it('should handle wsError', () => {
    store.dispatch(wsError('Test error'));
    expect(store.getState().profileOrders.connectionStatus).to.equal('error');
    expect(store.getState().profileOrders.error).to.equal('Test error');
  });

  it('should handle wsMessage', () => {
    const mockOrders = [
      { ...mockOrder, updatedAt: '2023-01-02T00:00:00.000Z' },
      { ...mockOrder, _id: '2', updatedAt: '2023-01-03T00:00:00.000Z' },
    ];
    store.dispatch(wsMessage({
      success: true,
      orders: mockOrders,
      total: 100,
      totalToday: 10
    }));
    expect(store.getState().profileOrders.orders).to.deep.equal(mockOrders.reverse());
    expect(store.getState().profileOrders.total).to.equal(100);
    expect(store.getState().profileOrders.totalToday).to.equal(10);
  });

  it('should handle wsReconnect', () => {
    store.dispatch(wsReconnect());
    expect(store.getState().profileOrders.connectionStatus).to.equal('connecting');
    expect(store.getState().profileOrders.error).to.equal(null);
  });

  it('should handle wsSendMessage', () => {
    const consoleSpy = cy.spy(console, 'log');
    store.dispatch(wsSendMessage({ type: 'test' }));
    expect(consoleSpy).to.be.calledWith('Sending message:', { type: 'test' });
  });

  describe('Selectors', () => {
    beforeEach(() => {
      store.dispatch(wsConnect());
      store.dispatch(wsMessage({
        success: true,
        orders: [mockOrder],
        total: 100,
        totalToday: 10
      }));
    });

    it('should select profile orders', () => {
      const state = store.getState();
      expect(selectProfileOrders(state as any)).to.deep.equal([mockOrder]);
    });

    it('should select profile orders total', () => {
      const state = store.getState();
      expect(selectProfileOrdersTotal(state as any)).to.equal(100);
    });

    it('should select profile orders total today', () => {
      const state = store.getState();
      expect(selectProfileOrdersTotalToday(state as any)).to.equal(10);
    });

    it('should select profile orders connection status', () => {
      const state = store.getState();
      expect(selectProfileOrdersConnectionStatus(state as any)).to.equal('connected');
    });

    it('should select profile order by id', () => {
      const state = store.getState();
      expect(selectProfileOrderById(state as any, '1')).to.deep.equal(mockOrder);
      expect(selectProfileOrderById(state as any, '2')).to.equal(undefined);
    });

    it('should select profile orders status', () => {
      const state = store.getState();
      expect(selectProfileOrdersStatus(state as any)).to.deep.equal({
        status: 'connected',
        error: null
      });
    });
  });
});
