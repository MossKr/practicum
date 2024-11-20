import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import api from '../../api/api';
import { AppDispatch, RootState } from '../../services/store';

const TOKEN_EXPIRY = 20 * 60 * 1000;

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authChecked: boolean;
  resetPasswordRequestSuccess: boolean;
  resetPasswordSuccess: boolean;
  error: string | null;
  intendedPath: string | null;
  notification: string | null;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}

interface ResetPasswordConfirmData {
  password: string;
  token: string;
}

interface ApiResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}



const setTokens = (accessToken: string, refreshToken: string): void => {
  Cookies.set('accessToken', accessToken, { expires: TOKEN_EXPIRY / (24 * 60 * 60 * 1000) });
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = (): void => {
  Cookies.remove('accessToken');
  localStorage.removeItem('refreshToken');
};

const createAsyncThunkWithTokens = <T, R>(
  type: string,
  apiCall: (arg: T) => Promise<ApiResponse>,
  options: { setTokens?: boolean; clearTokens?: boolean; returnUser?: boolean } = {}
) => {
  return createAsyncThunk<R, T, { rejectValue: string }>(
    type,
    async (arg, { rejectWithValue }) => {
      try {
        const response = await apiCall(arg);
        if (options.setTokens && response.accessToken && response.refreshToken) {
          setTokens(response.accessToken, response.refreshToken);
        }
        if (options.clearTokens) {
          clearTokens();
        }
        return (options.returnUser && response.user ? response.user : response) as R;
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  );
};

export const register = createAsyncThunkWithTokens<RegisterData, User>(
  'auth/register',
  (data) => api.register(data.email, data.password, data.name),
  { setTokens: true, returnUser: true }
);

export const login = createAsyncThunkWithTokens<LoginData, User>(
  'auth/login',
  (data) => api.login(data.email, data.password),
  { setTokens: true, returnUser: true }
);

export const logout = createAsyncThunk<ApiResponse, void, { state: RootState }>(
  'auth/logout',
  async (_, { dispatch }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('Refresh token not found');
    const response = await api.logout(refreshToken);
    if (response.success) {
      clearTokens();
      dispatch(setIntendedPath('/profile'));
    }
    return response;
  }
);

export const refreshToken = createAsyncThunk<
  ApiResponse,
  void,
  {
    state: RootState;
    rejectValue: string
  }
>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) throw new Error('Refresh token not found');

      const response = await api.refreshToken(refreshTokenValue);

      if (response.success && response.accessToken && response.refreshToken) {
        setTokens(response.accessToken, response.refreshToken);
        return response;
      } else {
        throw new Error('Invalid refresh token response');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to refresh token'
      );
    }
  }
);


export const getUser = createAsyncThunk<User, void, { state: RootState; rejectValue: string }>(
  'auth/getUser',
  async (_, { dispatch, rejectWithValue }) => {
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
      if (!token) {
        throw new Error('No access token available');
      }
      const response = await api.getUser(token);
      if (!response.user || !response.user.email || !response.user.name) {
        throw new Error('Invalid user data received');
      }
      return { email: response.user.email, name: response.user.name };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get user');
    }
  }
);


export const updateUser = createAsyncThunk<User, Partial<User>, { state: RootState; rejectValue: string }>(
  'auth/updateUser',
  async (userData, { dispatch, rejectWithValue }) => {
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
      if (!token) {
        throw new Error('No access token available');
      }
      const response = await api.updateUser(token, userData);
      if (!response.user || !response.user.email || !response.user.name) {
        throw new Error('Invalid user data received');
      }
      return { email: response.user.email, name: response.user.name };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user');
    }
  }
);

export const resetPassword = createAsyncThunk<ApiResponse, string>(
  'auth/resetPassword',
  async (email) => {
    return await api.resetPassword(email);
  }
);

export const resetPasswordConfirm = createAsyncThunk<ApiResponse, ResetPasswordConfirmData>(
  'auth/resetPasswordConfirm',
  async ({ password, token }) => {
    return await api.resetPasswordConfirm(password, token);
  }
);


export const checkAuth = createAsyncThunk<
  User,
  void,
  {
    state: RootState;
    dispatch: AppDispatch
  }
>(
  'auth/checkAuth',
  async (_, { dispatch }) => {
    const accessToken = Cookies.get('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    if (accessToken && refreshTokenValue) {
      try {
        return await dispatch(getUser()).unwrap();
      } catch (error) {
        try {

          await dispatch(refreshToken()).unwrap();
          return await dispatch(getUser()).unwrap();
        } catch (refreshError) {
          throw new Error('Unable to refresh token');
        }
      }
    } else {
      throw new Error('No tokens found');
    }
  }
);

export const checkTokens = (): { accessToken: string | undefined; refreshToken: string | null } => ({
  accessToken: Cookies.get('accessToken'),
  refreshToken: localStorage.getItem('refreshToken')
});

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authChecked: false,
  resetPasswordRequestSuccess: false,
  resetPasswordSuccess: false,
  error: null,
  intendedPath: null,
  notification: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearResetPasswordSuccess: (state) => { state.resetPasswordSuccess = false; },
    clearResetPasswordRequestSuccess: (state) => { state.resetPasswordRequestSuccess = false; },
    setIntendedPath: (state, action: PayloadAction<string>) => {
      state.intendedPath = action.payload;
    },
    clearIntendedPath: (state) => {
      state.intendedPath = null;
    },
    setNotification: (state, action: PayloadAction<string | null>) => {
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
        state.error = action.payload ?? null;
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
        state.error = action.payload ?? null;
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
        state.error = action.error.message ?? null;
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
        state.error = action.error.message ?? null;
        if (action.error.message === 'Token not found') {
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
        state.error = action.error.message ?? null;
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
        state.error = action.error.message ?? null;
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
        state.error = action.error.message ?? null;
        state.notification = 'Ошибка при подтверждении нового пароля. Попробуйте еще раз';
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
        state.error = action.error.message ?? null;
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

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectNotification = (state: RootState) => state.auth.notification;
export default authSlice.reducer;
