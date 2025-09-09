
  export const customeraccountEndpoints = (builder) => ({
      createCustomeraccount: builder.mutation({
          query: (data) => ({
              url: `customeraccount`,
              method: "POST",
              body: data,
          }),
      }),
      editCustomeraccount: builder.mutation({
          query: (data) => ({
              url: `customeraccount/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCustomeraccounts: builder.query({
        query: () => `customeraccount`,
      }),
      getCustomeraccountDetail: builder.query({
          query: (id) => `customeraccount/${id}`,
      }),
      deleteCustomeraccount: builder.mutation({
          query: (id) => ({
              url: `customeraccount/${id}`,
              method: "DELETE",
          }),
      }),
  });