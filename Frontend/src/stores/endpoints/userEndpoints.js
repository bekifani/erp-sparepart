
  export const userEndpoints = (builder) => ({
      createUser: builder.mutation({
          query: (data) => ({
              url: `user`,
              method: "POST",
              body: data,
          }),
      }),
      editUser: builder.mutation({
          query: (data) => ({
              url: `user/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getUsers: builder.query({
        query: () => `user`,
      }),
      getUserDetail: builder.query({
          query: (id) => `user/${id}`,
      }),
      deleteUser: builder.mutation({
          query: (id) => ({
              url: `user/${id}`,
              method: "DELETE",
          }),
      }),
      resetUserPassword: builder.mutation({
        query: (data) => ({
            url: `reset_user_password`,
            method: "POST",
            body: data
        }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
          url: `change_password`,
          method: "POST",
          body: data
      }),
    }),
  });