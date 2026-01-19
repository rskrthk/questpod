import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const submitEnquiryForm = createAsyncThunk(
  "enquiry/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/submitEnquiry", formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Submission failed");
    }
  }
);

const enquirySlice = createSlice({
  name: "enquiry",
  initialState: { loading: false, success: false, error: null },
  reducers: {
    resetEnquiryForm: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEnquiryForm.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitEnquiryForm.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitEnquiryForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetEnquiryForm } = enquirySlice.actions;
export default enquirySlice.reducer;
