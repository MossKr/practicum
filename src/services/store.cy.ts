// store.cy.ts
import { store } from '../../src/services/store';
import rootReducer from '../../src/services/rootReducer';

describe('Redux Store', () => {
  it('should have the correct initial state', () => {
    const initialState = store.getState();
    const expectedState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).to.deep.equal(expectedState);
  });

  it('should have all expected reducers', () => {
    const state = store.getState();


    const expectedReducers = [
      'ingredients',
      'lego',
      'currentIngredient',
      'order',
      'auth',
      'feed',
      'profileOrders'
    ];

    expectedReducers.forEach(reducer => {
      expect(state).to.have.property(reducer);
    });
  });

  it('should have correct initial state for each reducer', () => {
  const state = store.getState();

  
  expect(state.ingredients).to.have.property('items').that.is.an('array');
  expect(state.lego).to.deep.equal({ bun: null, ingredients: [] });
  expect(state.currentIngredient).to.deep.equal({ ingredient: null });
  expect(state.order).to.have.property('orderNumber');
  expect(state.auth).to.have.property('user');
  expect(state.feed).to.have.property('orders');
  expect(state.profileOrders).to.have.property('orders');
});


  it('should have correct middleware configuration', () => {
    const state = store.getState();


    expect(state).to.have.property('feed');
    expect(state).to.have.property('profileOrders');
  });
});
