import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { setIntendedPath } from '../services/auth/authSlice';

interface ProtectedRouteElementProps {
  element: React.ReactElement;
  allowAuthorized?: boolean;
  redirectPath: string;
}

function ProtectedRouteElement({ element, allowAuthorized = true, redirectPath }: ProtectedRouteElementProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, authChecked, intendedPath } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (allowAuthorized && !isAuthenticated && location.pathname !== '/login') {
      dispatch(setIntendedPath(location.pathname));
    }
  }, [allowAuthorized, isAuthenticated, location.pathname, dispatch]);

  if (!authChecked) {
    return null;
  }

  if (!allowAuthorized && isAuthenticated) {
    return <Navigate to={intendedPath || '/'} replace />;
  }

  if (allowAuthorized && !isAuthenticated) {
    if (location.pathname === '/reset-password') {
      const fromForgotPassword = localStorage.getItem('fromForgotPassword');
      if (!fromForgotPassword) {
        return <Navigate to="/forgot-password" replace />;
      }
    } else {
      return <Navigate to={redirectPath} state={{ from: location.pathname }} replace />;
    }
  }

  return element;
}

export default ProtectedRouteElement;
