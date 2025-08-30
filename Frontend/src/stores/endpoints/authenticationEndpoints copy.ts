import { EndpointBuilder } from '@reduxjs/toolkit/query';
interface CsrfResponse {
  csrf_token: string;
}


interface User {
  id: number;
  name: string;
  email: string;
  // Add other properties as necessary
}

interface LoginResponse {
  success: string;
  data: { token: string, user: User };
  status: string;
}

interface LoginRequest {
  username: string;
  password: string;
}


export const authenticationEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
    getCsrfToken: builder.query<CsrfResponse, void>({
        query: () => `user`,
    }),  
    loginUser: builder.mutation<LoginResponse, LoginRequest>({
        query: (data) => ({
            url: `login`,
            method: "POST",
            body: data,
        }),
    }),
    signUpUser: builder.mutation({
        query: (data: any) => ({
            url: `register`,
            method: "POST",
            body: data,
        }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
          url: `logout`,
          method: "POST"
      }),
    }),
    getAuthenticatedUser: builder.query({
      query: () => `get_my_info`,
    }),
    getPasswordResetPin: builder.query({
      query: (email: string) => `send_reset_password_pin/${email}`
    }),
    getResendPasswordResetPin: builder.query({
      query: (email: string) => `resend_reset_password_pin/${email}`
    }),
    ResetPassword: builder.mutation({
      query: (data: any) => ({
          url: `login_user`,
          method: "POST",
          body: data,
      }),
    }),
  });