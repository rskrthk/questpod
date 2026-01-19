// src/redux/slices/interviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get token for auth
const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 🔥 AsyncThunk to delete interview
export const deleteInterview = createAsyncThunk(
  "interview/deleteInterview",
  async (mockId, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/student/interviewHistory/delete",
        { mockId },
        { headers: getAuthHeader() }
      );
      return mockId; // Return mockId to remove it from the Redux list
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.error || "Failed to delete interview"
      );
    }
  }
);

const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    interviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    setInterviews: (state, action) => {
      state.interviews = action.payload;
    },
    clearInterviewError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = state.interviews.filter(
          (interview) => interview.mockId !== action.payload
        );
      })
      .addCase(deleteInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setInterviews, clearInterviewError } = interviewSlice.actions;
export default interviewSlice.reducer;
