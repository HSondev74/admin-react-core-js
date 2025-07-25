import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  getUser,
  setUser,
  clearAuthData,
} from '../../utils/authToken';
import authApi from '../../api/http/auth';
import usersApi from '../../api/http/users';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const { accessToken, refreshToken, ...userData } = response;
      
      // Store tokens and user data
      setToken(accessToken);
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }
      setUser(userData);
      
      return { user: userData, token: accessToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    clearAuthData();
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await usersApi.getUserInfo();
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user info');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUser(),
    token: getToken(),
    refreshToken: getRefreshToken(),
    isAuthenticated: !!getToken(),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
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
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
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
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
