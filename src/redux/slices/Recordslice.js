import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  answer_recording: [],
};

const slice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    RECORDING_ANSWER: (state, action) => {
      state.answer_recording = action.payload;
    },
  },
});

export const { RECORDING_ANSWER } = slice.actions;

export default slice.reducer;
