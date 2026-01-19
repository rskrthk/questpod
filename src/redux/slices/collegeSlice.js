import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchColleges = createAsyncThunk(
  "college/fetchColleges",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/admin/college/list", {
        headers: getAuthHeader(),
      });
      return res.data.colleges || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch colleges"
      );
    }
  }
);

export const createCollege = createAsyncThunk(
  "college/createCollege",
  async (collegeData, thunkAPI) => {
    try {
      const res = await axios.post("/api/admin/college/create", collegeData, {
        headers: getAuthHeader(),
      });
      return res.data.college;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to create college"
      );
    }
  }
);

export const updateCollege = createAsyncThunk(
  "college/updateCollege",
  async (collegeData, thunkAPI) => {
    try {
      const res = await axios.post("/api/admin/college/update", collegeData, {
        headers: getAuthHeader(),
      });
      return res.data.college || res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to update college"
      );
    }
  }
);

// export const deleteCollege = createAsyncThunk(
//   "college/deleteCollege",
//   async ({ id, currentStatus }, thunkAPI) => {
//     try {
//       if (!id) throw new Error("Invalid college ID");

//       const newStatus =
//         currentStatus?.toLowerCase() === "active" ? "Inactive" : "Active";

//       const payload = { id, status: newStatus };

//       await axios.post("/api/admin/college/delete", payload, {
//         headers: getAuthHeader(),
//       });

//       return payload;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(
//         err?.response?.data?.message || err.message || "Failed to update status"
//       );
//     }
//   }
// );


// 🔹 Soft Delete college (toggle Active/Inactive)
export const deleteCollege = createAsyncThunk(
  "college/deleteCollege",
  async ({ id, currentStatus }, thunkAPI) => {
    try {
      if (!id) throw new Error("Invalid college ID");

      const newStatus =
        currentStatus?.toLowerCase() === "active" ? "Inactive" : "Active";

      const payload = { id, status: newStatus };

      await axios.post("/api/admin/college/delete", payload, {
        headers: getAuthHeader(),
      });

      return payload; // Used in reducer to update status
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to update status"
      );
    }
  }
);

export const viewCollege = createAsyncThunk(
  "college/viewCollege",
  async (id, thunkAPI) => {
    try {
      const res = await axios.post(
        "/api/admin/college/view",
        { id },
        { headers: getAuthHeader() }
      );
      return res.data.college;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to view college"
      );
    }
  }
);

export const fetchCollegeAdminProfile = createAsyncThunk(
  "college/fetchCollegeAdminProfile",
  async (_, thunkAPI) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      const url = `${baseUrl}/api/college/profile/view`;

      const res = await axios.get(url, {
        headers: getAuthHeader(),
      });

      return res.data;
    } catch (err) {
      const errorMsg = err?.response?.data?.error || "Failed to fetch profile";
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

export const updateCollegeAdminLogo = createAsyncThunk(
  "college/updateCollegeAdminLogo",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("logo", file);

      const res = await axios.post("/api/college/profile/update", formData, {
        headers: getAuthHeader(),
      });

      if (res.data?.success) {
        return res.data;
      } else {
        return thunkAPI.rejectWithValue(res.data?.error || "Update failed");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue("Update logo failed");
    }
  }
);

const collegeSlice = createSlice({
  name: "college",
  initialState: {
    colleges: [],
    user: null,
    loading: false,
    uploading: false,
    error: null,
    fetchProfileError: null,
    updateLogoError: null,
    updateLogoSuccess: false,
    logoPreview: null,
  },

  reducers: {
    clearCollegeError: (state) => {
      state.error = null;
      state.fetchProfileError = null;
      state.updateLogoError = null;
      state.updateLogoSuccess = false;
    },
    setLogoPreview: (state, action) => {
      state.logoPreview = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchColleges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColleges.fulfilled, (state, action) => {
        state.loading = false;
        state.colleges = action.payload;
      })
      .addCase(fetchColleges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCollege.fulfilled, (state, action) => {
        state.colleges.push(action.payload);
      })
      .addCase(createCollege.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateCollege.fulfilled, (state, action) => {
        const index = state.colleges.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.colleges[index] = action.payload;
        }
      })
      .addCase(updateCollege.rejected, (state, action) => {
        state.error = action.payload;
      })

      // .addCase(deleteCollege.fulfilled, (state, action) => {
      //   const { id, status } = action.payload;
      //   const index = state.colleges.findIndex(
      //     (c) => c._id === id || c.id === id
      //   );
      //   if (index !== -1) {
      //     state.colleges[index].status = status;
      //   }
      // })
      // .addCase(deleteCollege.rejected, (state, action) => {
      //   state.error = action.payload;
      // })

      // ─── Delete College ─────────────────────
      .addCase(deleteCollege.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.colleges.findIndex((c) => c._id === id || c.id === id);
        if (index !== -1) {
          state.colleges[index].status = status;
        }
      })
      .addCase(deleteCollege.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(viewCollege.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchCollegeAdminProfile.pending, (state) => {
        state.loading = true;
        state.fetchProfileError = null;
      })
      .addCase(fetchCollegeAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCollegeAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.fetchProfileError = action.payload;
      })

      .addCase(updateCollegeAdminLogo.pending, (state) => {
        state.uploading = true;
        state.updateLogoError = null;
        state.updateLogoSuccess = false;
      })
      .addCase(updateCollegeAdminLogo.fulfilled, (state) => {
        state.uploading = false;
        state.updateLogoSuccess = true;
      })
      .addCase(updateCollegeAdminLogo.rejected, (state, action) => {
        state.uploading = false;
        state.updateLogoError = action.payload;
      });
  },
});

export const { clearCollegeError, setLogoPreview } = collegeSlice.actions;
export default collegeSlice.reducer;
