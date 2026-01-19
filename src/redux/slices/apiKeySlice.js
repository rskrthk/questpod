import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchApiKey = createAsyncThunk("apiKey/fetchApiKey", async (_, thunkAPI) => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.get("/api/api-credentials/view", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res?.data?.apiKey || "";
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to fetch API key");
  }
});

export const saveApiKey = createAsyncThunk("apiKey/saveApiKey", async (apiKey, thunkAPI) => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.post(
      "/api/api-credentials/create",
      { apiKey },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data?.data?.apiKey || "";
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to save API key");
  }
});

const apiKeySlice = createSlice({
  name: "apiKey",
  initialState: {
    value: "",
    loading: false,
    error: null,
  },
  reducers: {
    updateApiKeyLocally: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiKey.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })
      .addCase(fetchApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveApiKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveApiKey.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })
      .addCase(saveApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateApiKeyLocally } = apiKeySlice.actions;
export default apiKeySlice.reducer;
