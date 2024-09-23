import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConstructorElement, Button, CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrop } from "react-dnd";
import styles from "./constructor.module.css";
import Modal from "../common/modal/modal";
import OrderDetails from "../order-details/order-details";
import { useModal } from "../../hooks/useModal";
import { fetchIngredients, selectIngredientsStatus } from "../../services/ingredients/ingredientsSlice";
import { addIngredient, removeIngredient, moveIngredient, clearConstructor, selectBun, selectIngredients, selectTotalPrice } from "../../services/constructor/constructorSlice";
import { createOrder, selectOrderNumber } from "../../services/order/orderSlice";
import Draggable from "./draggable-constructor";

function BurgerConstructor() {
    const dispatch = useDispatch();
    const status = useSelector(selectIngredientsStatus);
    const bun = useSelector(selectBun);
    const constructorIngredients = useSelector(selectIngredients);
    const { isModalOpen, openModal, closeModal } = useModal();
    const orderNumber = useSelector(selectOrderNumber);
    const totalPrice = useSelector(selectTotalPrice);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchIngredients());
        }
    }, [status, dispatch]);

    const [, dropTarget] = useDrop({
        accept: "ingredient",
        drop(item) {
            dispatch(addIngredient(item));
        },
    });

    const handleOrderClick = useCallback(() => {
        if (bun && constructorIngredients.length > 0) {
            const ingredientIds = [bun._id, ...constructorIngredients.map((item) => item._id), bun._id];
            dispatch(createOrder(ingredientIds));
            openModal();
        }
    }, [dispatch, bun, constructorIngredients, openModal]);

    const handleRemove = useCallback(
        (uniqueId) => {
            dispatch(removeIngredient(uniqueId));
        },
        [dispatch]
    );

    const moveIngredientHandler = useCallback(
        (dragIndex, hoverIndex) => {
            dispatch(moveIngredient({ dragIndex, hoverIndex }));
        },
        [dispatch]
    );

    const handleclearConstructor = useCallback(() => {
        dispatch(clearConstructor());
    }, [dispatch]);

    return (
        <div className={`pt-25 ${styles.mainContainer}`} ref={dropTarget}>
            {bun ? (
                <div className={styles.bunsAlign}>
                    <ConstructorElement type="top" isLocked={true} text={`${bun.name} (верх)`} price={bun.price} thumbnail={bun.image} />
                </div>
            ) : (
                <div className={`${styles.emptyBun} ${styles.dropZone}`}>
                    <div className={styles.dropIcon}>+</div>
                    <div className="text text_type_main-small text_color_inactive">Перетащите булку</div>
                </div>
            )}
            <div className={`${styles.fillContainer} ${styles.customScroll}`}>
                {constructorIngredients.length > 0 ? (
                    constructorIngredients.map((item, index) => (
                        <Draggable key={item.uniqueId} ingredient={item} index={index} handleRemove={() => handleRemove(item.uniqueId)} moveIngredient={moveIngredientHandler}>
                            <ConstructorElement text={item.name} price={item.price} thumbnail={item.image} handleClose={() => handleRemove(item.uniqueId)} />
                        </Draggable>
                    ))
                ) : (
                    <div className={`${styles.emptyFilling} ${styles.dropZone}`}>
                        <div className={styles.dropIcon}>+</div>
                        <div className="text text_type_main-small text_color_inactive">Перетащите начинку</div>
                    </div>
                )}
            </div>
            {bun ? (
                <div className={styles.bunsAlign}>
                    <ConstructorElement type="bottom" isLocked={true} text={`${bun.name} (низ)`} price={bun.price} thumbnail={bun.image} />
                </div>
            ) : null}

            <div className={styles.orderElements}>
                <div className={`${styles.orderTotal} text text_type_digits-medium`}>
                    {totalPrice}
                    <CurrencyIcon type="primary" className="pl-2" />
                </div>

                <div className={styles.orderButton}>
                    <Button htmlType="button" type="secondary" size="medium" onClick={handleclearConstructor} disabled={!bun && constructorIngredients.length === 0}>
                        Сбросить
                    </Button>
                    <Button htmlType="button" type="primary" size="medium" onClick={handleOrderClick} disabled={!bun || constructorIngredients.length === 0}>
                        Оформить заказ
                    </Button>
                </div>
            </div>

            {isModalOpen && (
                <Modal title={" "} isOpen={isModalOpen} onClose={closeModal}>
                    <OrderDetails orderNumber={orderNumber} />
                </Modal>
            )}
        </div>
    );
}

export default React.memo(BurgerConstructor);
