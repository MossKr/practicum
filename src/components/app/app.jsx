import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import AppHeader from "../app-header/app-header";
import { fetchIngredients } from "../../services/ingredients/ingredientsSlice";
import { checkAuth } from "../../services/auth/authSlice";
import ProtectedRouteElement from "../protected-route";
import Modal from "../common/modal/modal";

import Home from "../../pages/home";
import Login from "../../pages/login";
import Register from "../../pages/register";
import ForgotPassword from "../../pages/forgot-password";
import ResetPassword from "../../pages/reset-password";
import Profile from "../../pages/profile";
import NotFound from "../../pages/not-found";
import IngredientDetails from "../burger-ingredients/details/ingredient-details";
import IngredientPage from "../../pages/ingredient-page";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkAuth());
  }, [dispatch]);



  const closeModal = () => {
    navigate(-1);
  };

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
        </Routes>
      )}
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
