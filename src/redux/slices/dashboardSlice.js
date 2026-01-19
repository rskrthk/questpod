import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        return rejectWithValue("No authentication token found. Please log in.");
      }

      const techStackResponse = await axios.get("/api/admin/dashboard", {
        headers,
      });
      const techStacks = techStackResponse.data.stacks;

      const mockOtherStats = {
        colleges: techStackResponse?.data?.colleges,
        students: techStackResponse?.data?.students,
        interviews: techStackResponse?.data?.interviews,
        completedInterviews: techStackResponse?.data?.completedInterviews,
        experienceLevels: {
          entryLevel: 800,
          junior: 1000,
          midLevel: 700,
          senior: 300,
        },
      };

      return {
        ...mockOtherStats,
        techStacks: techStacks,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          return rejectWithValue(
            "Authentication failed or access denied. Please log in again."
          );
        }
      }
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to fetch dashboard data."
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: {
      colleges: null,
      students: null,
      interviews: null,
      completedInterviews: null,
      experienceLevels: null,
      techStacks: [],
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = {
          colleges: null,
          students: null,
          interviews: null,
          completedInterviews: null,
          experienceLevels: null,
          techStacks: [],
        };
      });
  },
});

export default dashboardSlice.reducer;
