
  export const supplierinvoiceEndpoints = (builder) => ({
      createSupplierinvoice: builder.mutation({
          query: (data) => ({
              url: `supplierinvoice`,
              method: "POST",
              body: data,
          }),
      }),
      editSupplierinvoice: builder.mutation({
          query: (data) => ({
              url: `supplierinvoice/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSupplierinvoices: builder.query({
        query: () => `supplierinvoice`,
      }),
      getSupplierinvoiceDetail: builder.query({
          query: (id) => `supplierinvoice/${id}`,
      }),
      deleteSupplierinvoice: builder.mutation({
          query: (id) => ({
              url: `supplierinvoice/${id}`,
              method: "DELETE",
          }),
      }),
  });