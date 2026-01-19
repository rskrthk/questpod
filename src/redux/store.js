import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import recordsReducer from "./slices/Recordslice";
import collegeReducer from "./slices/collegeSlice";
import codeRecordReducer from "./slices/codeRecordslice";
import dashboardReducer from "./slices/dashboardSlice";
import apiKeyReducer from "./slices/apiKeySlice";
import interviewReducer from "./slices/interviewDeleteSlice";
import contactReducer from "./slices/contactSlice";
import enquiryReducer from "./slices/enquirySlice";
import jobReducer from "./slices/jobSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    records: recordsReducer,
    college: collegeReducer,
    codeRecord: codeRecordReducer,
    dashboard: dashboardReducer,
    apiKey: apiKeyReducer,
    inrerview: interviewReducer,
    contact: contactReducer,
    enquiry: enquiryReducer,
    job: jobReducer,
  },
});
