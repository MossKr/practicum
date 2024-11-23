import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ConstructorElement, Button, CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrop } from "react-dnd";
import styles from "./constructor.module.css";
import Modal from "../common/modal/modal";
import OrderDetails from "../order-details/order-details";
import { useModal } from "../../hooks/useModal";
import { addIngredient, removeIngredient, moveIngredient, clearConstructor, selectBun, selectIngredients, selectTotalPrice } from "../../services/constructor/constructorSlice";
import { createOrder, selectOrderStatus, selectOrderError, clearOrder } from "../../services/order/orderSlice";
import Draggable from "./draggable-constructor";
import { selectIsAuthenticated } from "../../services/auth/authSlice";
import { Ingredient, ConstructorIngredient } from '../../utils/typesTs';


interface ConstructorState {
    bun: Ingredient | null;
    ingredients: Ingredient[];
}

const BurgerConstructor: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingProgress, setLoadingProgress] = useState<number>(0);
    const bun = useAppSelector(selectBun);
    const constructorIngredients = useAppSelector(selectIngredients);
    const { isModalOpen, openModal, closeModal } = useModal();
    const orderStatus = useAppSelector(selectOrderStatus);
    const orderError = useAppSelector(selectOrderError);
    const totalPrice = useAppSelector(selectTotalPrice);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [, dropTarget] = useDrop<Ingredient, void, {}>({
        accept: "ingredient",
        drop(item) {
            dispatch(addIngredient(item));
        },
    });
    useEffect(() => {
    if (isAuthenticated) {
        const savedState = localStorage.getItem('constructorState');
        if (savedState) {
            try {
                const { bun, ingredients } = JSON.parse(savedState) as ConstructorState;
                dispatch(clearConstructor());
                if (bun) {
                    dispatch(addIngredient(bun));
                }
                ingredients.forEach(ingredient => {
                    dispatch(addIngredient(ingredient));
                });
                localStorage.removeItem('constructorState');
            } catch (error) {
                console.error('Ошибка при восстановлении состояния конструктора:', error);
                localStorage.removeItem('constructorState');
            }
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
            const currentState: ConstructorState = {
                bun: bun,
                ingredients: constructorIngredients.map(ingredient => ({
                ...ingredient,
                uniqueId: undefined
            }))
        };
            localStorage.setItem('constructorState', JSON.stringify(currentState));
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        if (bun && constructorIngredients.length > 0) {
            const ingredientIds = [
                bun._id,
                ...constructorIngredients.map((item: ConstructorIngredient) => item._id),
                bun._id
            ];

            setIsLoading(true);
            openModal();
            const clearSimulation = simulateProgress();

            dispatch(createOrder(ingredientIds))
                .unwrap()
                .then(() => {
                    setLoadingProgress(100);
                })
                .catch((err: Error | string) => {
                    const errorMessage = typeof err === 'object' ? err.message : err;
                    if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('токен')) {
                        navigate('/login', { state: { from: location.pathname } });
                    } else {
                        alert(`Ошибка при оформлении заказа: ${errorMessage}`);
                    }
                    closeModal();
                })
                .finally(() => {
                    setIsLoading(false);
                    clearSimulation();
                });
        }
    }, [
        dispatch,
        bun,
        constructorIngredients,
        isAuthenticated,
        navigate,
        location.pathname,
        openModal,
        closeModal,
        simulateProgress,
    ]);

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
        (uniqueId: string) => {
            dispatch(removeIngredient(uniqueId));
        },
        [dispatch]
    );

    const moveIngredientHandler = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            dispatch(moveIngredient({ dragIndex, hoverIndex }));
        },
        [dispatch]
    );

    const handleClearConstructor = useCallback(() => {
        dispatch(clearConstructor());
    }, [dispatch]);

    const isConstructorEmpty = useMemo(() => !bun && constructorIngredients.length === 0, [bun, constructorIngredients]);

    const renderBun = useCallback(
        (type: "top" | "bottom") => {
            return bun ? (
                <div className={styles.bunsAlign} data-testid={`constructor-bun-${type}`}>
                    <ConstructorElement
                        type={type}
                        isLocked={true}
                        text={`${bun.name} (${type === "top" ? "верх" : "низ"})`}
                        price={bun.price}
                        thumbnail={bun.image}
                    />
                </div>
            ) : (
                <div className={`${styles.emptyBun} ${styles.dropZone}`} data-testid={`constructor-empty-bun-${type}`}>
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
              <div className={`${styles.emptyFilling} ${styles.dropZone}`} data-testid="constructor-empty-ingredients">
                  <div className={styles.dropIcon}>+</div>
                  <div className="text text_type_main-small text_color_inactive">Перетащите начинку</div>
              </div>
          );
      }
      return constructorIngredients.map((item: ConstructorIngredient, index: number) => (
          <Draggable
              key={item.uniqueId}
              ingredient={item}
              index={index}
              handleRemove={() => handleRemove(item.uniqueId)}
              moveIngredient={moveIngredientHandler}
              data-testid={`constructor-ingredient-${index}`}
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
        <div className={`pt-25 ${styles.mainContainer}`} ref={dropTarget} data-testid="constructor-dropzone">
            {renderBun("top")}
            <div className={`${styles.fillContainer} ${styles.customScroll}`} data-testid="constructor-ingredient">{renderIngredients}</div>
            {renderBun("bottom")}

            <div className={styles.orderElements}>
                <div className={`${styles.orderTotal} text text_type_digits-medium`} data-testid="total-price">
                    {totalPrice}
                    <CurrencyIcon type="primary" />
                </div>

                <div className={styles.orderButton}>
                    <Button
                        htmlType="button"
                        type="secondary"
                        size="medium"
                        onClick={handleClearConstructor}
                        disabled={isConstructorEmpty}
                        data-testid="clear-constructor"
                    >
                        Сбросить
                    </Button>
                    <Button
                        htmlType="button"
                        type="primary"
                        size="medium"
                        onClick={handleOrderClick}
                        disabled={!bun || constructorIngredients.length === 0 || isLoading}
                        data-testid="order-button"
                    >
                        {isLoading ? 'Оформление...' : 'Оформить заказ'}
                    </Button>
                </div>
            </div>

            {isModalOpen && (
    <Modal title={" "} isOpen={isModalOpen} onClose={handleCloseModal} data-testid="order-modal">
        {orderStatus === 'loading' || loadingProgress < 100 ? (
            <div className={styles.loadingContainer} data-testid="order-loading">
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
            <OrderDetails data-testid="order-details"/>
        )}
    </Modal>
            )}
        </div>
    );
};

export default React.memo(BurgerConstructor);
