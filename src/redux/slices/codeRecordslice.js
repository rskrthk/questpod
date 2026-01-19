import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  codeAnswer: "",
};

const codeRecordSlice = createSlice({
  name: "codeRecord",
  initialState,
  reducers: {
    SET_CODE_ANSWER: (state, action) => {
      state.codeAnswer = action.payload;
    },
    CLEAR_CODE_ANSWER: (state) => {
      state.codeAnswer = "";
    },
  },
});

export const { SET_CODE_ANSWER, CLEAR_CODE_ANSWER } = codeRecordSlice.actions;
export default codeRecordSlice.reducer;
