
  export const customerEndpoints = (builder) => ({
      createCustomer: builder.mutation({
          query: (data) => ({
              url: `customer`,
              method: "POST",
              body: data,
          }),
      }),
      editCustomer: builder.mutation({
          query: (data) => ({
              url: `customer/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCustomers: builder.query({
        query: () => `customer`,
      }),
      getCustomerDetail: builder.query({
          query: (id) => `customer/${id}`,
      }),
      deleteCustomer: builder.mutation({
          query: (id) => ({
              url: `customer/${id}`,
              method: "DELETE",
          }),
      }),
  });