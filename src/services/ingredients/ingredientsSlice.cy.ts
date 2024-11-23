/// <reference types="cypress" />

import ingredientsReducer, {
  fetchIngredients,
  clearIngredientsError,
  selectIngredients,
  selectIngredientsStatus,
  selectIngredientsError,
} from './ingredientsSlice';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { RootState } from '../store';

type TestStore = EnhancedStore<{
  ingredients: ReturnType<typeof ingredientsReducer>;
}>;

describe('ingredientsSlice', () => {
  let store: TestStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
      },
    });
  });

  it('should handle initial state', () => {
    const state = store.getState().ingredients;
    expect(state).to.deep.equal({
      items: [],
      status: 'idle',
      error: null,
    });
  });

  it('should handle clearIngredientsError', () => {
    store.dispatch({ type: 'ingredients/setError', payload: 'Some error' });
    store.dispatch(clearIngredientsError());
    const state = store.getState().ingredients;
     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(state.error).to.be.null;
  });

  describe('fetchIngredients', () => {
    it('should handle fetchIngredients.pending', () => {
      store.dispatch({ type: fetchIngredients.pending.type });
      const state = store.getState().ingredients;
      expect(state.status).to.equal('loading');
       // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(state.error).to.be.null;
    });

    it('should handle fetchIngredients.fulfilled', () => {
      const mockIngredients = [{ id: '1', name: 'Ingredient 1' }, { id: '2', name: 'Ingredient 2' }];
      store.dispatch({ type: fetchIngredients.fulfilled.type, payload: mockIngredients });
      const state = store.getState().ingredients;
      expect(state.status).to.equal('succeeded');
      expect(state.items).to.deep.equal(mockIngredients);
    });

    it('should handle fetchIngredients.rejected', () => {
      store.dispatch({ type: fetchIngredients.rejected.type, payload: 'Error message' });
      const state = store.getState().ingredients;
      expect(state.status).to.equal('failed');
      expect(state.error).to.equal('Error message');
    });
  });

  describe('async actions', () => {
    it('creates FETCH_INGREDIENTS_FULFILLED when fetching ingredients has been done', () => {
      const mockIngredients = [{ id: '1', name: 'Ingredient 1' }, { id: '2', name: 'Ingredient 2' }];
      cy.stub(global, 'fetch').resolves({
        ok: true,
        json: cy.stub().resolves({ success: true, data: mockIngredients }),
      });

      // @ts-ignore
      return cy.wrap(store.dispatch(fetchIngredients())).then(() => {
        const state = store.getState().ingredients;
        expect(state.status).to.equal('succeeded');
        expect(state.items).to.deep.equal(mockIngredients);
      });
    });

    it('creates FETCH_INGREDIENTS_REJECTED when fetching ingredients fails', () => {
      cy.stub(global, 'fetch').rejects(new Error('API Error'));

      // @ts-ignore
      return cy.wrap(store.dispatch(fetchIngredients())).then(() => {
        const state = store.getState().ingredients;
        expect(state.status).to.equal('failed');
        expect(state.error).to.equal('API Error');
      });
    });
  });


  describe('selectors', () => {
    it('should select ingredients', () => {
      const mockIngredients = [{ id: '1', name: 'Ingredient 1' }];
      store.dispatch({ type: fetchIngredients.fulfilled.type, payload: mockIngredients });
      const state = store.getState() as RootState;
      expect(selectIngredients(state)).to.deep.equal(mockIngredients);
    });

    it('should select ingredients status', () => {
      store.dispatch({ type: fetchIngredients.pending.type });
      const state = store.getState() as RootState;
      expect(selectIngredientsStatus(state)).to.equal('loading');
    });

    it('should select ingredients error', () => {
      store.dispatch({ type: fetchIngredients.rejected.type, payload: 'Error message' });
      const state = store.getState() as RootState;
      expect(selectIngredientsError(state)).to.equal('Error message');
    });
  });
});
