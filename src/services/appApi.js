import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiUrl = import.meta.env.VITE_API_URL;


const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
  }),

  endpoints: (builder) => ({
    
    signupUser: builder.mutation({
      query: (user) => ({
          url: "/users",
          method: "POST",
          body: user,
      }),
  }),


  loginUser: builder.mutation({
      query: (user) => ({
          url: "/users/login",
          method: "POST",
          body: user,
      }),
  }),


    LogOutUser: builder.mutation({
      query: (payload) => ({
        url: "/logout",
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});

export const { useSignupUserMutation, useLoginUserMutation, useLogOutUserMutation } = appApi;

export default appApi;
