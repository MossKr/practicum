/// <reference types="cypress" />

import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  selectTotalPrice
} from './constructorSlice';
import { Ingredient } from '../../utils/typesTs';

describe('Constructor Slice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: Ingredient = {
    _id: 'bun1',
    name: 'Test Bun',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'bun.jpg',
    image_mobile: 'bun_mobile.jpg',
    image_large: 'bun_large.jpg',
    __v: 0
  };

  const mockIngredient: Ingredient = {
    _id: 'ing1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 50,
    price: 50,
    image: 'ing.jpg',
    image_mobile: 'ing_mobile.jpg',
    image_large: 'ing_large.jpg',
    __v: 0
  };

  it('should handle initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).to.deep.equal(initialState);
  });

  it('should handle addIngredient for bun', () => {
    const actual = constructorReducer(initialState, addIngredient(mockBun));
    expect(actual.bun).to.deep.equal(mockBun);
  });

  it('should handle addIngredient for non-bun', () => {
    const actual = constructorReducer(initialState, addIngredient(mockIngredient));
    expect(actual.ingredients).to.have.length(1);
    expect(actual.ingredients[0]).to.include(mockIngredient);
    expect(actual.ingredients[0]).to.have.property('uniqueId');
  });

  it('should handle removeIngredient', () => {
    const stateWithIngredient = constructorReducer(initialState, addIngredient(mockIngredient));
    const uniqueId = stateWithIngredient.ingredients[0].uniqueId;
    const actual = constructorReducer(stateWithIngredient, removeIngredient(uniqueId));
    expect(actual.ingredients).to.have.length(0);
  });

  it('should handle moveIngredient', () => {
    const stateWithIngredients = constructorReducer(
      constructorReducer(initialState, addIngredient(mockIngredient)),
      addIngredient({...mockIngredient, _id: 'ing2'})
    );
    const actual = constructorReducer(stateWithIngredients, moveIngredient({dragIndex: 0, hoverIndex: 1}));
    expect(actual.ingredients[0]._id).to.equal('ing2');
    expect(actual.ingredients[1]._id).to.equal('ing1');
  });

  it('should handle clearConstructor', () => {
    const stateWithItems = constructorReducer(
      constructorReducer(initialState, addIngredient(mockBun)),
      addIngredient(mockIngredient)
    );
    const actual = constructorReducer(stateWithItems, clearConstructor());
    expect(actual).to.deep.equal(initialState);
  });

  it('should calculate total price correctly', () => {
    const stateWithItems = constructorReducer(
      constructorReducer(initialState, addIngredient(mockBun)),
      addIngredient(mockIngredient)
    );
    const totalPrice = selectTotalPrice({ lego: stateWithItems });
    expect(totalPrice).to.equal(250); // 100 (bun) * 2 + 50 (ingredient)
  });
});
