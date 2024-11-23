/// <reference types="cypress" />

import authReducer, {
  register,
  login,
  logout,
  getUser,
  updateUser,
  resetPassword,
  resetPasswordConfirm,
  checkAuth,
  clearResetPasswordSuccess,
  setIntendedPath,
  clearIntendedPath,
  setNotification,
} from './authSlice';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

describe('Auth Slice', () => {
  let store: EnhancedStore;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
    });
  });

  it('should handle initial state', () => {
    expect(store.getState().auth).to.deep.equal({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      authChecked: false,
      resetPasswordRequestSuccess: false,
      resetPasswordSuccess: false,
      error: null,
      intendedPath: null,
      notification: null,
    });
  });

  it('should handle register.fulfilled', () => {
    store.dispatch(register.fulfilled({ email: 'test@test.com', name: 'Test User' }, '', { email: 'test@test.com', password: 'password', name: 'Test User' }));
    expect(store.getState().auth.isAuthenticated).to.equal(true);
    expect(store.getState().auth.user).to.deep.equal({ email: 'test@test.com', name: 'Test User' });
    expect(store.getState().auth.notification).to.equal('Регистрация успешно завершена');
  });

  it('should handle login.fulfilled', () => {
    store.dispatch(login.fulfilled({ email: 'test@test.com', name: 'Test User' }, '', { email: 'test@test.com', password: 'password' }));
    expect(store.getState().auth.isAuthenticated).to.equal(true);
    expect(store.getState().auth.user).to.deep.equal({ email: 'test@test.com', name: 'Test User' });
    expect(store.getState().auth.notification).to.equal('Вход выполнен успешно');
  });

  it('should handle logout.fulfilled', () => {
    store.dispatch(logout.fulfilled({success: true}, ''));
    expect(store.getState().auth.isAuthenticated).to.equal(false);
    expect(store.getState().auth.user).to.equal(null);
    expect(store.getState().auth.notification).to.equal('Вы успешно вышли из системы');
  });

  it('should handle getUser.fulfilled', () => {
    store.dispatch(getUser.fulfilled({ email: 'test@test.com', name: 'Test User' }, ''));
    expect(store.getState().auth.isAuthenticated).to.equal(true);
    expect(store.getState().auth.user).to.deep.equal({ email: 'test@test.com', name: 'Test User' });
  });

  it('should handle updateUser.fulfilled', () => {
    store.dispatch(updateUser.fulfilled({ email: 'updated@test.com', name: 'Updated User' }, '', { email: 'updated@test.com' }));
    expect(store.getState().auth.user).to.deep.equal({ email: 'updated@test.com', name: 'Updated User' });
    expect(store.getState().auth.notification).to.equal('Данные пользователя успешно обновлены');
  });

  it('should handle resetPassword.fulfilled', () => {
    store.dispatch(resetPassword.fulfilled({success: true}, '', 'test@test.com'));
    expect(store.getState().auth.resetPasswordRequestSuccess).to.equal(true);
    expect(store.getState().auth.notification).to.equal('Инструкции по сбросу пароля отправлены на ваш email');
  });

  it('should handle resetPasswordConfirm.fulfilled', () => {
    store.dispatch(resetPasswordConfirm.fulfilled({success: true}, '', { password: 'newpassword', token: 'token' }));
    expect(store.getState().auth.resetPasswordSuccess).to.equal(true);
    expect(store.getState().auth.notification).to.equal('Пароль успешно изменен');
  });

  it('should handle checkAuth.fulfilled', () => {
    store.dispatch(checkAuth.fulfilled({ email: 'test@test.com', name: 'Test User' }, ''));
    expect(store.getState().auth.isAuthenticated).to.equal(true);
    expect(store.getState().auth.user).to.deep.equal({ email: 'test@test.com', name: 'Test User' });
    expect(store.getState().auth.authChecked).to.equal(true);
  });

  it('should handle clearResetPasswordSuccess', () => {
    store.dispatch(resetPasswordConfirm.fulfilled({success: true}, '', { password: 'newpassword', token: 'token' }));
    expect(store.getState().auth.resetPasswordSuccess).to.equal(true);
    store.dispatch(clearResetPasswordSuccess());
    expect(store.getState().auth.resetPasswordSuccess).to.equal(false);
  });

  it('should handle setIntendedPath and clearIntendedPath', () => {
    store.dispatch(setIntendedPath('/profile'));
    expect(store.getState().auth.intendedPath).to.equal('/profile');
    store.dispatch(clearIntendedPath());
    expect(store.getState().auth.intendedPath).to.equal(null);
  });

  it('should handle setNotification', () => {
    store.dispatch(setNotification('Test notification'));
    expect(store.getState().auth.notification).to.equal('Test notification');
  });
});
