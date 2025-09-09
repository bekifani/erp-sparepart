
  export const customerproductvisibilitEndpoints = (builder) => ({
      createCustomerproductvisibilit: builder.mutation({
          query: (data) => ({
              url: `customerproductvisibilit`,
              method: "POST",
              body: data,
          }),
      }),
      editCustomerproductvisibilit: builder.mutation({
          query: (data) => ({
              url: `customerproductvisibilit/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCustomerproductvisibilits: builder.query({
        query: () => `customerproductvisibilit`,
      }),
      getCustomerproductvisibilitDetail: builder.query({
          query: (id) => `customerproductvisibilit/${id}`,
      }),
      deleteCustomerproductvisibilit: builder.mutation({
          query: (id) => ({
              url: `customerproductvisibilit/${id}`,
              method: "DELETE",
          }),
      }),
  });