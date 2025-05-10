import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const baseUrl = "http://localhost:5000/api/v1/";

// Register
export const register = createAsyncThunk('register', async (credentials, { rejectWithValue }) => {
    try {
        const response = await fetch(baseUrl + 'register', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        toast.success("Registered successfully")
        return data;
    } catch (error) {
        toast.error(error.message)
        return rejectWithValue(error.message || 'Something went wrong');
    }
});

// Login
export const login = createAsyncThunk('login', async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(baseUrl + 'login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        toast.error(data.error || 'Login failed');
        return rejectWithValue(data.error || 'Login failed');
      }
  
      toast.success("Logged in successfully");
      return data;
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
      return rejectWithValue(error.message || 'Something went wrong');
    }
  });
  

// Logout
export const logout = createAsyncThunk('logout', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(baseUrl + 'logout', {
            method: 'POST',
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.message || 'Logout failed');
        }
        toast.success("Logged out successfully")
        return data;
    } catch (error) {
        toast.error(error.message || 'Something went wrong')
        return rejectWithValue(error.message || 'Something went wrong');
    }
});

// Get Profile
export const getProfile = createAsyncThunk('getProfile', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(baseUrl + 'profile', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData.message || 'Unauthorized');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message || 'Something went wrong');
    }
});

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        status: false,
        loading: false,
        error: null,
        isLoggedIn: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.status = true;
                state.isLoggedIn = true;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.status = false;
                state.isLoggedIn = false;
            })

            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.status = true;
                state.isLoggedIn = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.status = false;
                state.isLoggedIn = false;
            })

            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.status = false;
                state.isLoggedIn = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // Get Profile
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.status = true;
                state.isLoggedIn = true;
                state.error = null;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                // Silent fail on 401, else show error
                if (action.payload !== 'Unauthorized') {
                    state.error = action.payload || action.error.message;
                }
                state.status = false;
                state.isLoggedIn = false;
            });
    },
});

export default authSlice.reducer;
