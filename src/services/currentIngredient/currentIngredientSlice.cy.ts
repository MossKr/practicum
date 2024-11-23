/// <reference types="cypress" />

import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import currentIngredientReducer, {
  setCurrentIngredient,
  clearCurrentIngredient,
  selectCurrentIngredient,
  selectCurrentIngredientName,
  selectCurrentIngredientPrice,
  selectCurrentIngredientImage,
} from './currentIngredientSlice';
import { Ingredient } from '../../utils/typesTs';

describe('Current Ingredient Slice', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        currentIngredient: currentIngredientReducer,
      },
    });
  });

  const mockIngredient: Ingredient = {
    _id: '1',
    name: 'Mock Ingredient',
    type: 'main',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 100,
    price: 50,
    image: 'mock-image-url',
    image_mobile: 'mock-mobile-image-url',
    image_large: 'mock-large-image-url',
    __v: 0, 
  };

  it('should handle initial state', () => {
    expect(store.getState().currentIngredient.ingredient).to.equal(null);
  });

  it('should handle setCurrentIngredient', () => {
    store.dispatch(setCurrentIngredient(mockIngredient));
    expect(store.getState().currentIngredient.ingredient).to.deep.equal(mockIngredient);
  });

  it('should handle clearCurrentIngredient', () => {
    store.dispatch(setCurrentIngredient(mockIngredient));
    store.dispatch(clearCurrentIngredient());
    expect(store.getState().currentIngredient.ingredient).to.equal(null);
  });

  it('should select current ingredient', () => {
    store.dispatch(setCurrentIngredient(mockIngredient));
    const selectedIngredient = selectCurrentIngredient(store.getState());
    expect(selectedIngredient).to.deep.equal(mockIngredient);
  });

  it('should select current ingredient name', () => {
    store.dispatch(setCurrentIngredient(mockIngredient));
    const selectedName = selectCurrentIngredientName(store.getState());
    expect(selectedName).to.equal('Mock Ingredient');
  });

  it('should select current ingredient price', () => {
    store.dispatch(setCurrentIngredient(mockIngredient));
    const selectedPrice = selectCurrentIngredientPrice(store.getState());
    expect(selectedPrice).to.equal(50);
  });

  it('should select current ingredient image', () => {
    store.dispatch(setCurrentIngredient(mockIngredient));
    const selectedImage = selectCurrentIngredientImage(store.getState());
    expect(selectedImage).to.equal('mock-image-url');
  });

  it('should return undefined for selectors when no ingredient is set', () => {
    expect(selectCurrentIngredientName(store.getState())).to.equal(undefined);
    expect(selectCurrentIngredientPrice(store.getState())).to.equal(undefined);
    expect(selectCurrentIngredientImage(store.getState())).to.equal(undefined);
  });
});
