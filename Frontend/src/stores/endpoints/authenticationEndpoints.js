export const authenticationEndpoints = (builder) => ({
    getCsrfToken: builder.query({
        query: () => `csrf-token`,
    }),  
    loginUser: builder.mutation({
        query: (data) => ({
            url: `login`,
            method: "POST",
            body: data,
        }),
    }),
    signUpUser: builder.mutation({
        query: (data) => ({
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
    getPasswordResetPin: builder.mutation({
      query: (data) => ({
        url: `send_reset_password_pin`,
        method: "POST",
        body: data,
       }),
    }),
    getResendPasswordResetPin: builder.mutation({
      query: (data) => ({
        url: `resend_reset_password_pin`,
        method: "POST",
        body: data,
       }),
    }),
    ResetPassword: builder.mutation({
      query: (data) => ({
          url: `reset_password`,
          method: "POST",
          body: data,
      }),
    }),
  });