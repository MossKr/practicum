import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import api from '../../api/api';

const TOKEN_EXPIRY = 20 * 60 * 1000;

const setTokens = (accessToken, refreshToken) => {
  Cookies.set('accessToken', accessToken, { expires: TOKEN_EXPIRY / (24 * 60 * 60 * 1000) });
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  Cookies.remove('accessToken');
  localStorage.removeItem('refreshToken');
};

const createAsyncThunkWithTokens = (type, apiCall, options = {}) => {
  return createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      const response = await apiCall(arg);
      if (options.setTokens && response.accessToken && response.refreshToken) {
        setTokens(response.accessToken, response.refreshToken);
      }
      if (options.clearTokens) {
        clearTokens();
      }
      return options.returnUser && response.user ? response.user : response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
};

export const register = createAsyncThunkWithTokens(
  'auth/register',
  (data) => api.register(data.email, data.password, data.name),
  { setTokens: true, returnUser: true }
);

export const login = createAsyncThunkWithTokens(
  'auth/login',
  (data) => api.login(data.email, data.password),
  { setTokens: true, returnUser: true }
);

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch, rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('Refresh token not found');
    const response = await api.logout(refreshToken);
    if (response.success) {
      clearTokens();
      dispatch(setIntendedPath('/profile'));
    }
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('Refresh token not found');
    const response = await api.refreshToken(refreshToken);
    if (response.success && response.accessToken && response.refreshToken) {
      setTokens(response.accessToken, response.refreshToken);
    }
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const getUser = createAsyncThunk('auth/getUser', async (_, { rejectWithValue, dispatch }) => {
  try {
    let token = Cookies.get('accessToken');
    if (!token) {
      const result = await dispatch(refreshToken());
      if (refreshToken.fulfilled.match(result)) {
        token = Cookies.get('accessToken');
      } else {
        throw new Error('Unable to refresh token');
      }
    }
    const response = await api.getUser(token);
    return response.user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateUser = createAsyncThunk('auth/updateUser', async (userData, { rejectWithValue, dispatch }) => {
  try {
    let token = Cookies.get('accessToken');
    if (!token) {
      const result = await dispatch(refreshToken());
      if (refreshToken.fulfilled.match(result)) {
        token = Cookies.get('accessToken');
      } else {
        throw new Error('Unable to refresh token');
      }
    }
    const response = await api.updateUser(token, userData);
    return response.user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (email, { rejectWithValue }) => {
  try {
    return await api.resetPassword(email);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const resetPasswordConfirm = createAsyncThunk('auth/resetPasswordConfirm', async ({ password, token }, { rejectWithValue }) => {
  try {
    return await api.resetPasswordConfirm(password, token);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { dispatch }) => {
  const accessToken = Cookies.get('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (accessToken && refreshToken) {
    try {
      return await dispatch(getUser()).unwrap();
    } catch (error) {
      try {
        await dispatch(refreshToken()).unwrap();
        return await dispatch(getUser()).unwrap();
      } catch (refreshError) {
        clearTokens();
        throw refreshError;
      }
    }
  } else {
    throw new Error('No tokens found');
  }
});

export const checkTokens = () => ({
  accessToken: Cookies.get('accessToken'),
  refreshToken: localStorage.getItem('refreshToken')
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    authChecked: false,
    resetPasswordRequestSuccess: false,
    resetPasswordSuccess: false,
    error: null,
    intendedPath: null,
    notification: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearResetPasswordSuccess: (state) => { state.resetPasswordSuccess = false; },
    clearResetPasswordRequestSuccess: (state) => { state.resetPasswordRequestSuccess = false; },
    setIntendedPath: (state, action) => {
      console.log('Setting intended path in reducer:', action.payload);
      state.intendedPath = action.payload;
    },
    clearIntendedPath: (state) => {
      console.log('Clearing intended path in reducer');
      state.intendedPath = null;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.notification = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.authChecked = true;
        state.error = null;
        state.notification = 'Регистрация успешно завершена';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        if (action.payload === 'Email already exists') {
          state.notification = 'Пользователь с таким email уже существует';
        } else {
          state.notification = 'Ошибка при регистрации. Попробуйте еще раз';
        }
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.notification = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.authChecked = true;
        state.error = null;
        state.notification = 'Вход выполнен успешно';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        if (action.payload === 'Invalid credentials') {
          state.notification = 'Неправильный логин или пароль';
        } else {
          state.notification = 'Ошибка при входе. Пожалуйста, попробуйте снова.';
        }
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.notification = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
        state.error = null;
        state.notification = 'Вы успешно вышли из системы';
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.notification = 'Ошибка при выходе из системы';
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.notification = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.authChecked = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
        state.error = action.payload;
        if (action.payload === 'Token not found') {
          state.notification = 'Токен не найден. Пожалуйста, войдите снова';
        } else {
          state.notification = 'Ошибка при получении данных пользователя';
        }
        clearTokens();
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.notification = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        state.notification = 'Данные пользователя успешно обновлены';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.notification = 'Ошибка при обновлении данных пользователя';
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.notification = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.resetPasswordRequestSuccess = true;
        state.error = null;
        state.notification = 'Инструкции по сбросу пароля отправлены на ваш email';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.notification = 'Ошибка при сбросе пароля. Попробуйте еще раз';
      })
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.notification = null;
      })
      .addCase(resetPasswordConfirm.fulfilled, (state) => {
        state.isLoading = false;
        state.resetPasswordSuccess = true;
        state.resetPasswordRequestSuccess = false;
        state.error = null;
        state.notification = 'Пароль успешно изменен';
      })
      .addCase(resetPasswordConfirm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.notification = 'Ошибка при подтверждении нового пароля. Попробуйте еще раз';
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
        state.error = action.payload;
        state.notification = 'Сессия истекла. Пожалуйста, войдите снова';
        clearTokens();
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.authChecked = false;
        state.error = null;
        state.notification = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.authChecked = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
        state.notification = 'Необходима повторная авторизация';
        clearTokens();
      });
  },


});

export const {
  clearError,
  clearResetPasswordSuccess,
  clearResetPasswordRequestSuccess,
  setIntendedPath,
  clearIntendedPath,
  setNotification,
} = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectNotification = (state) => state.auth.notification;

export default authSlice.reducer;
