import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Util: Get Auth Header
const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async Thunk to submit contact form
export const submitContactForm = createAsyncThunk(
  "contact/submit",
  async (formValues, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Append all form fields
      formData.append("universityName", formValues.universityName);
      formData.append("name", formValues.name);
      formData.append("email", formValues.email);
      formData.append("issueType", formValues.issueType);
      formData.append("subject", formValues.subject);
      formData.append("message", formValues.message);

      // Append attachment if available
      if (formValues.attachment) {
        formData.append("attachment", formValues.attachment);
      }

      const response = await axios.post(
        "/api/contactForm",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeader(),
          },
        }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Submission failed");
    }
  }
);

// Slice
const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetContactForm: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetContactForm } = contactSlice.actions;
export default contactSlice.reducer;
