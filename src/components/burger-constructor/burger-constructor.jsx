import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ConstructorElement, Button, CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrop } from "react-dnd";
import styles from "./constructor.module.css";
import Modal from "../common/modal/modal";
import OrderDetails from "../order-details/order-details";
import { useModal } from "../../hooks/useModal";
import { fetchIngredients, selectIngredientsStatus } from "../../services/ingredients/ingredientsSlice";
import { addIngredient, removeIngredient, moveIngredient, clearConstructor, selectBun, selectIngredients, selectTotalPrice } from "../../services/constructor/constructorSlice";
import { createOrder, selectOrderNumber, selectOrderStatus, selectOrderError, clearOrder } from "../../services/order/orderSlice";
import Draggable from "./draggable-constructor";
import { selectIsAuthenticated, checkTokens } from "../../services/auth/authSlice";

function BurgerConstructor() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const status = useSelector(selectIngredientsStatus);
    const bun = useSelector(selectBun);
    const constructorIngredients = useSelector(selectIngredients);
    const { isModalOpen, openModal, closeModal } = useModal();
    const orderNumber = useSelector(selectOrderNumber);
    const orderStatus = useSelector(selectOrderStatus);
    const orderError = useSelector(selectOrderError);
    const totalPrice = useSelector(selectTotalPrice);
    const isAuthenticated = useSelector(selectIsAuthenticated);

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
    useEffect(() => {
        if (isAuthenticated) {
            const savedState = localStorage.getItem('constructorState');
            if (savedState) {
                const { bun, ingredients } = JSON.parse(savedState);
                if (bun) dispatch(addIngredient(bun));
                ingredients.forEach(ingredient => dispatch(addIngredient(ingredient)));
                localStorage.removeItem('constructorState');
            }
        }
    }, [isAuthenticated, dispatch]);

    const simulateProgress = useCallback(() => {
        setLoadingProgress(0);
        const interval = setInterval(() => {
            setLoadingProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleOrderClick = useCallback(() => {
        if (!isAuthenticated) {

            const currentState = {
                bun: bun,
                ingredients: constructorIngredients
            };
            localStorage.setItem('constructorState', JSON.stringify(currentState));

            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        if (bun && constructorIngredients.length > 0) {
            const ingredientIds = [bun._id, ...constructorIngredients.map(item => item._id), bun._id];
            setIsLoading(true);
            openModal();
            const clearSimulation = simulateProgress();
            dispatch(createOrder({ ingredients: ingredientIds, token: checkTokens().accessToken }))
                .finally(() => {
                    setIsLoading(false);
                    clearSimulation();
                    setLoadingProgress(100);
                });
        }
    }, [dispatch, bun, constructorIngredients, isAuthenticated, navigate, location.pathname, openModal, simulateProgress]);


    useEffect(() => {
        if (orderStatus === 'failed') {
            closeModal();
            alert(`Ошибка при оформлении заказа: ${orderError}`);
        }
    }, [orderStatus, orderError, closeModal]);

    const handleCloseModal = useCallback(() => {
        closeModal();
        dispatch(clearOrder());
        dispatch(clearConstructor());
        setLoadingProgress(0);
    }, [closeModal, dispatch]);

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

    const handleClearConstructor = useCallback(() => {
        dispatch(clearConstructor());
    }, [dispatch]);

    const isConstructorEmpty = useMemo(() => !bun && constructorIngredients.length === 0, [bun, constructorIngredients]);

    const renderBun = useCallback(
        (type) => {
            return bun ? (
                <div className={styles.bunsAlign}>
                    <ConstructorElement
                        type={type}
                        isLocked={true}
                        text={`${bun.name} (${type === "top" ? "верх" : "низ"})`}
                        price={bun.price}
                        thumbnail={bun.image}
                    />
                </div>
            ) : (
                <div className={`${styles.emptyBun} ${styles.dropZone}`}>
                    <div className={styles.dropIcon}>+</div>
                    <div className="text text_type_main-small text_color_inactive">Перетащите булку</div>
                </div>
            );
        },
        [bun]
    );

    const renderIngredients = useMemo(() => {
        if (isConstructorEmpty) {
            return (
                <div className={`${styles.emptyFilling} ${styles.dropZone}`}>
                    <div className={styles.dropIcon}>+</div>
                    <div className="text text_type_main-small text_color_inactive">Перетащите начинку</div>
                </div>
            );
        }
        return constructorIngredients.map((item, index) => (
            <Draggable
                key={item.uniqueId}
                ingredient={item}
                index={index}
                handleRemove={() => handleRemove(item.uniqueId)}
                moveIngredient={moveIngredientHandler}
            >
                <ConstructorElement
                    text={item.name}
                    price={item.price}
                    thumbnail={item.image}
                    handleClose={() => handleRemove(item.uniqueId)}
                />
            </Draggable>
        ));
    }, [constructorIngredients, handleRemove, moveIngredientHandler, isConstructorEmpty]);

    return (
        <div className={`pt-25 ${styles.mainContainer}`} ref={dropTarget}>
            {renderBun("top")}
            <div className={`${styles.fillContainer} ${styles.customScroll}`}>{renderIngredients}</div>
            {renderBun("bottom")}

            <div className={styles.orderElements}>
                <div className={`${styles.orderTotal} text text_type_digits-medium`}>
                    {totalPrice}
                    <CurrencyIcon type="primary" className="pl-2" />
                </div>

                <div className={styles.orderButton}>
                    <Button
                        htmlType="button"
                        type="secondary"
                        size="medium"
                        onClick={handleClearConstructor}
                        disabled={isConstructorEmpty}
                    >
                        Сбросить
                    </Button>
                    <Button
                        htmlType="button"
                        type="primary"
                        size="medium"
                        onClick={handleOrderClick}
                        disabled={!bun || constructorIngredients.length === 0 || isLoading}
                    >
                        {isLoading ? 'Оформление...' : 'Оформить заказ'}
                    </Button>
                </div>
            </div>

            {isModalOpen && (
                <Modal title={" "} isOpen={isModalOpen} onClose={handleCloseModal}>
                    {orderStatus === 'loading' || loadingProgress < 100 ? (
                        <div className={styles.loadingContainer}>
                            <p className="text text_type_main-medium">Оформляем заказ...</p>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{width: `${loadingProgress}%`}}
                                ></div>
                            </div>
                            <p className="text text_type_main-small">{loadingProgress}%</p>
                        </div>
                    ) : (
                        <OrderDetails orderNumber={orderNumber} />
                    )}
                </Modal>
            )}
        </div>
    );
}

export default React.memo(BurgerConstructor);
