
  export const supplierpricingrulecustomerEndpoints = (builder) => ({
      createSupplierpricingrulecustomer: builder.mutation({
          query: (data) => ({
              url: `supplierpricingrulecustomer`,
              method: "POST",
              body: data,
          }),
      }),
      editSupplierpricingrulecustomer: builder.mutation({
          query: (data) => ({
              url: `supplierpricingrulecustomer/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSupplierpricingrulecustomers: builder.query({
        query: () => `supplierpricingrulecustomer`,
      }),
      getSupplierpricingrulecustomerDetail: builder.query({
          query: (id) => `supplierpricingrulecustomer/${id}`,
      }),
      deleteSupplierpricingrulecustomer: builder.mutation({
          query: (id) => ({
              url: `supplierpricingrulecustomer/${id}`,
              method: "DELETE",
          }),
      }),
  });