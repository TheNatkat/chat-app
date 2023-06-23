import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";
import api from "../services/api";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    data: null,
  },
  reducers: {
    setUserStatus: (state, action) => {
      state.status = action.payload;
    },
    setAccessToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(appApi.endpoints.signupUser.matchFulfilled, (state, { payload }) => payload);
    builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
      state.token = payload.accessToken;
      state.data = payload.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${payload.accessToken}`;
    });
    builder.addMatcher(appApi.endpoints.LogOutUser.matchFulfilled, (state) => {
      state.token = null;
      state.data = null;

      delete api.defaults.headers.common['Authorization'];
    });
  },
});

export const { setUserStatus, setAccessToken } = userSlice.actions;
export default userSlice.reducer;
