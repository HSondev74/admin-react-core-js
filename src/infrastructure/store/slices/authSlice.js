import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getToken, setToken, getRefreshToken, setRefreshToken, getUser, setUser, clearAuthData } from '../../utils/authToken';
import authApi from '../../api/http/auth';
import usersApi from '../../api/http/users';
import { setRefreshToken, setToken } from '../../utils/authToken';
import { getCookie, removeCookie, setCookie } from '../../../app/utils/cookies';

// Async thunks
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials);
    const { token, refreshToken, ...userData } = response.data.data;

    return { user: userData, token: token, refreshToken: refreshToken };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.logout();
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await authApi.register(userData);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const fetchUserInfo = createAsyncThunk('auth/fetchUserInfo', async (_, { rejectWithValue }) => {
  try {
    const userData = await usersApi.getUserInfo();
    return userData;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user info');
  }
});

export const refreshToken = createAsyncThunk('auth/refresh-token', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await authApi.refreshToken(auth.refreshToken);
    const { token, refreshToken } = response.data.data;

    return { token, refreshToken };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to refresh token');
  }
});

const initialState = {
  user: null,
  token: getCookie('accessToken'),
  refreshToken: getCookie('refreshToken'),
  isAuthenticated: !!getCookie('accessToken'),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      removeCookie('accessToken');
      removeCookie('refreshToken');
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;

      setCookie('accessToken', action.payload.token, { expires: 1 });
      setCookie('refreshToken', action.payload.refreshToken, { expires: 7 });
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      // Khi đăng xuất thành công, đặt lại trạng thái. Redux Persist sau đó sẽ xóa localStorage.
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;

      removeCookie('accessToken');
      removeCookie('refreshToken');
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch user info
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    // refreshToken
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;

      setCookie('accessToken', action.payload.token, { expires: 1 });
      setCookie('refreshToken', action.payload.refreshToken, { expires: 7 });
    });
  }
});

export const { clearError, resetAuthState } = authSlice.actions;
export const authReducer = authSlice.reducer;
