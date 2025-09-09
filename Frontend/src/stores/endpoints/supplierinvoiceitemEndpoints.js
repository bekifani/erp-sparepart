
  export const supplierinvoiceitemEndpoints = (builder) => ({
      createSupplierinvoiceitem: builder.mutation({
          query: (data) => ({
              url: `supplierinvoiceitem`,
              method: "POST",
              body: data,
          }),
      }),
      editSupplierinvoiceitem: builder.mutation({
          query: (data) => ({
              url: `supplierinvoiceitem/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSupplierinvoiceitems: builder.query({
        query: () => `supplierinvoiceitem`,
      }),
      getSupplierinvoiceitemDetail: builder.query({
          query: (id) => `supplierinvoiceitem/${id}`,
      }),
      deleteSupplierinvoiceitem: builder.mutation({
          query: (id) => ({
              url: `supplierinvoiceitem/${id}`,
              method: "DELETE",
          }),
      }),
  });