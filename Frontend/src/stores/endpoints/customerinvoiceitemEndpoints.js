
  export const customerinvoiceitemEndpoints = (builder) => ({
      createCustomerinvoiceitem: builder.mutation({
          query: (data) => ({
              url: `customerinvoiceitem`,
              method: "POST",
              body: data,
          }),
      }),
      editCustomerinvoiceitem: builder.mutation({
          query: (data) => ({
              url: `customerinvoiceitem/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCustomerinvoiceitems: builder.query({
        query: () => `customerinvoiceitem`,
      }),
      getCustomerinvoiceitemDetail: builder.query({
          query: (id) => `customerinvoiceitem/${id}`,
      }),
      deleteCustomerinvoiceitem: builder.mutation({
          query: (id) => ({
              url: `customerinvoiceitem/${id}`,
              method: "DELETE",
          }),
      }),
  });