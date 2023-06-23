import { createSlice } from "@reduxjs/toolkit";

const homeSlice = createSlice({
  name: "home",
  initialState: {
    isSignUp: true,
  },
  reducers: {
    setSignUp(state) {
      state.isSignUp = !state.isSignUp;
    },
  },
});

export const { setSignUp } = homeSlice.actions;
export default homeSlice.reducer;
