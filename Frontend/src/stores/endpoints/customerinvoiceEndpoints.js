
  export const customerinvoiceEndpoints = (builder) => ({
      createCustomerinvoice: builder.mutation({
          query: (data) => ({
              url: `customerinvoice`,
              method: "POST",
              body: data,
          }),
      }),
      editCustomerinvoice: builder.mutation({
          query: (data) => ({
              url: `customerinvoice/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCustomerinvoices: builder.query({
        query: () => `customerinvoice`,
      }),
      getCustomerinvoiceDetail: builder.query({
          query: (id) => `customerinvoice/${id}`,
      }),
      deleteCustomerinvoice: builder.mutation({
          query: (id) => ({
              url: `customerinvoice/${id}`,
              method: "DELETE",
          }),
      }),
  });