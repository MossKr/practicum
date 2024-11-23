/// <reference types="cypress" />

import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import feedReducer, {
  wsInitConnection,
  wsConnecting,
  wsConnect,
  wsDisconnect,
  wsError,
  wsMessage,
  FeedState,
  FeedOrder
} from './feedSlice';

describe('Feed Slice', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feed: feedReducer,
      },
    });
  });

  const mockOrder: FeedOrder = {
    ingredients: ['ingredient1', 'ingredient2'],
    _id: '1',
    status: 'done',
    number: 1234,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  it('should handle initial state', () => {
    expect(store.getState().feed).to.deep.equal({
      orders: [],
      total: 0,
      totalToday: 0,
      connectionStatus: 'idle',
      error: null
    });
  });

  it('should handle wsInitConnection', () => {
    store.dispatch(wsInitConnection());
    expect(store.getState().feed.connectionStatus).to.equal('idle');
    expect(store.getState().feed.error).to.equal(null);
  });

  it('should handle wsConnecting', () => {
    store.dispatch(wsConnecting({ url: 'ws://test.com' }));
    expect(store.getState().feed.connectionStatus).to.equal('connecting');
    expect(store.getState().feed.error).to.equal(null);
  });

  it('should handle wsConnect', () => {
    store.dispatch(wsConnect());
    expect(store.getState().feed.connectionStatus).to.equal('connected');
    expect(store.getState().feed.error).to.equal(null);
  });

  it('should handle wsDisconnect', () => {
    store.dispatch(wsMessage({
      success: true,
      orders: [mockOrder],
      total: 100,
      totalToday: 10
    }));
    store.dispatch(wsDisconnect());
    expect(store.getState().feed).to.deep.equal({
      orders: [],
      total: 0,
      totalToday: 0,
      connectionStatus: 'disconnected',
      error: null
    });
  });

  it('should handle wsError', () => {
    store.dispatch(wsError('Test error'));
    expect(store.getState().feed.connectionStatus).to.equal('error');
    expect(store.getState().feed.error).to.equal('Test error');
  });

  it('should handle wsMessage', () => {
    store.dispatch(wsMessage({
      success: true,
      orders: [mockOrder],
      total: 100,
      totalToday: 10
    }));
    expect(store.getState().feed).to.deep.equal({
      orders: [mockOrder],
      total: 100,
      totalToday: 10,
      connectionStatus: 'connected',
      error: null
    });
  });

  it('should select feed orders', () => {
    store.dispatch(wsMessage({
      success: true,
      orders: [mockOrder],
      total: 100,
      totalToday: 10
    }));
    const state = store.getState() as { feed: FeedState };
    expect(state.feed.orders).to.deep.equal([mockOrder]);
  });

  it('should select feed total', () => {
    store.dispatch(wsMessage({
      success: true,
      orders: [mockOrder],
      total: 100,
      totalToday: 10
    }));
    const state = store.getState() as { feed: FeedState };
    expect(state.feed.total).to.equal(100);
  });

  it('should select feed total today', () => {
    store.dispatch(wsMessage({
      success: true,
      orders: [mockOrder],
      total: 100,
      totalToday: 10
    }));
    const state = store.getState() as { feed: FeedState };
    expect(state.feed.totalToday).to.equal(10);
  });

  it('should select feed connection status', () => {
    store.dispatch(wsConnect());
    const state = store.getState() as { feed: FeedState };
    expect(state.feed.connectionStatus).to.equal('connected');
  });

  it('should select feed error', () => {
    store.dispatch(wsError('Test error'));
    const state = store.getState() as { feed: FeedState };
    expect(state.feed.error).to.equal('Test error');
  });
});
