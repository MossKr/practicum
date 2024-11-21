import React, { useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Location, useParams } from 'react-router-dom';
import { useAppDispatch } from "../../hooks/redux";
import AppHeader from "../app-header/app-header";
import { fetchIngredients } from "../../services/ingredients/ingredientsSlice";
import { checkAuth } from "../../services/auth/authSlice";
import ProtectedRouteElement from "../protected-route";
import Modal from "../common/modal/modal";
import Feed from "../../pages/feed/feed";
import OrderDetails from "../../pages/feed/order-details";
import OrderPage from "../../pages/feed/order-page";

import Home from "../../pages/home";
import Login from "../../pages/login";
import Register from "../../pages/register";
import ForgotPassword from "../../pages/forgot-password";
import ResetPassword from "../../pages/reset-password";
import Profile from "../../pages/profile";
import NotFound from "../../pages/not-found";
import IngredientDetails from "../burger-ingredients/details/ingredient-details";
import IngredientPage from "../../pages/ingredient-page";

interface LocationState {
  background?: Location;
}

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && 'background' in location.state
    ? (location.state as LocationState).background
    : undefined;

  const OrderDetailsWrapper = () => {
    const { id } = useParams<{ id: string }>();
    return <OrderDetails orderId={id} />;
  };

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkAuth());
  }, [dispatch]);

  const closeModal = useCallback((): void => {

    if (background) {
      navigate(background, {
        replace: true,
        state: { background: undefined }
      });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate, background]);

  return (
    <>
      <AppHeader />
      <Routes location={background || location}>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <ProtectedRouteElement
              element={<Login />}
              allowAuthorized={false}
              redirectPath="/"
            />
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRouteElement
              element={<Register />}
              allowAuthorized={false}
              redirectPath="/"
            />
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRouteElement
              element={<ForgotPassword />}
              allowAuthorized={false}
              redirectPath="/"
            />
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRouteElement
              element={<ResetPassword />}
              allowAuthorized={false}
              redirectPath="/"
            />
          }
        />
        <Route
          path="/profile/*"
          element={
            <ProtectedRouteElement
              element={<Profile />}
              redirectPath="/login"
            />
          }
        />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:id" element={<OrderPage />} />

        <Route
          path="/profile/orders/:id"
          element={
            <ProtectedRouteElement
              element={<OrderPage />}
              redirectPath="/login"
            />
         }
       />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal isOpen={true} onClose={closeModal} title="Детали ингредиента">
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
             path="/feed/:id"
             element={
               <Modal isOpen={true} onClose={closeModal} title={' '}>
                 <OrderDetailsWrapper />
               </Modal>
             }
           />
           <Route
             path="/profile/orders/:id"
             element={
               <Modal isOpen={true} onClose={closeModal} title={' '}>
                 <OrderDetailsWrapper />
               </Modal>
             }
           />
        </Routes>
      )}
    </>
  );
}

function AppWrapper(): JSX.Element {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
