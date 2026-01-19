import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Helper to get auth headers
const getAuthHeaders = () => {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || sessionStorage.getItem("token");
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async Thunks
export const fetchJobs = createAsyncThunk(
  "job/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/job/list", {
        headers: getAuthHeaders(),
      });
      return response.data.jobs;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch jobs");
    }
  }
);

export const fetchPublicJobs = createAsyncThunk(
  "job/fetchPublicJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/jobs/list");
      return response.data.jobs;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch jobs");
    }
  }
);

export const fetchPublicJobById = createAsyncThunk(
  "job/fetchPublicJobById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/jobs/${id}`);
      return response.data.job;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch job");
    }
  }
);

export const createJob = createAsyncThunk(
  "job/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/admin/job/create", jobData, {
        headers: {
            ...getAuthHeaders(),
            // No need to set Content-Type for FormData, axios detects it
        },
      });
      return response.data.job;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to create job");
    }
  }
);

export const updateJob = createAsyncThunk(
  "job/updateJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/admin/job/update", jobData, {
        headers: {
            ...getAuthHeaders(),
        },
      });
      return response.data.job;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to update job");
    }
  }
);

export const deleteJob = createAsyncThunk(
  "job/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/job/delete?id=${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete job");
    }
  }
);

export const viewJob = createAsyncThunk(
  "job/viewJob",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin/job/view?id=${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch job details");
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    currentJob: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Fetch Public Jobs
    builder
      .addCase(fetchPublicJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchPublicJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Job
    builder
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Update Job
    builder
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        state.currentJob = action.payload;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Delete Job
    builder
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
        toast.success("Job deleted successfully");
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // View Job
    builder
      .addCase(viewJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewJob.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(viewJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Fetch Public Job By ID
    builder
      .addCase(fetchPublicJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchPublicJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
