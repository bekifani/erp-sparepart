
  export const accounttypeEndpoints = (builder) => ({
      createAccounttype: builder.mutation({
          query: (data) => ({
              url: `accounttype`,
              method: "POST",
              body: data,
          }),
      }),
      editAccounttype: builder.mutation({
          query: (data) => ({
              url: `accounttype/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getAccounttypes: builder.query({
        query: () => `accounttype`,
      }),
      getAccounttypeDetail: builder.query({
          query: (id) => `accounttype/${id}`,
      }),
      deleteAccounttype: builder.mutation({
          query: (id) => ({
              url: `accounttype/${id}`,
              method: "DELETE",
          }),
      }),
  });