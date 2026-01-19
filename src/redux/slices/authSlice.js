// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Utility to get the Authorization header from sessionStorage token
 */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });

      const token = res.data?.token;
      const user = res.data?.user;

      if (token && user) {
        sessionStorage.setItem("token", token);
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", user?.email);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      const fieldErrors = err?.response?.data?.errors || {};
      return thunkAPI.rejectWithValue({ message, fieldErrors });
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post("/api/auth/signup", userData);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      const fieldErrors = err?.response?.data?.errors || {};
      return thunkAPI.rejectWithValue({ message, fieldErrors });
    }
  }
);

// FORGOT PASSWORD
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, thunkAPI) => {
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Request failed";
      const fieldErrors = err?.response?.data?.errors || {};
      return thunkAPI.rejectWithValue({ message, fieldErrors });
    }
  }
);

// FETCH ADMIN PROFILE
export const fetchAdminProfile = createAsyncThunk(
  "auth/fetchAdminProfile",
  async (_, thunkAPI) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

      const url = `${baseUrl}/api/admin/profile/view`;

      console.log(" Fetching admin profile from:", url);

      const res = await axios.get(url, {
        headers: getAuthHeader(),
      });

      console.log(" Admin profile fetched successfully:", res.data);

      return res.data;
    } catch (err) {
      const errorMsg = err?.response?.data?.error || "Failed to fetch profile";

      console.error(" Error fetching admin profile:", errorMsg);

      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// SLICE
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loggedIn: false,
    loading: false,
    loginError: null,
    registerError: null,
    loginFieldErrors: {},
    registerFieldErrors: {},
    forgotPasswordError: null,
    forgotPasswordSuccess: null,
  },
  reducers: {
    logout: (state) => {
      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      sessionStorage.removeItem("user");
      state.user = null;
      state.loggedIn = false;
    },
    clearLoginError: (state) => {
      state.loginError = null;
      state.loginFieldErrors = {};
    },
    clearRegisterError: (state) => {
      state.registerError = null;
      state.registerFieldErrors = {};
    },
    clearForgotPasswordStatus: (state) => {
      state.forgotPasswordError = null;
      state.forgotPasswordSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.loginError = null;
        state.loginFieldErrors = {};
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload.message;
        state.loginFieldErrors = action.payload.fieldErrors;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.registerError = null;
        state.registerFieldErrors = {};
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registerError = action.payload.message;
        state.registerFieldErrors = action.payload.fieldErrors;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.forgotPasswordSuccess = null;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPasswordSuccess = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotPasswordError = action.payload.message;
      })

      // Admin Profile
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  logout,
  clearLoginError,
  clearRegisterError,
  clearForgotPasswordStatus,
} = authSlice.actions;

// EXPORT REDUCER
export default authSlice.reducer;
