
  export const supplieraccountEndpoints = (builder) => ({
      createSupplieraccount: builder.mutation({
          query: (data) => ({
              url: `supplieraccount`,
              method: "POST",
              body: data,
          }),
      }),
      editSupplieraccount: builder.mutation({
          query: (data) => ({
              url: `supplieraccount/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSupplieraccounts: builder.query({
        query: () => `supplieraccount`,
      }),
      getSupplieraccountDetail: builder.query({
          query: (id) => `supplieraccount/${id}`,
      }),
      deleteSupplieraccount: builder.mutation({
          query: (id) => ({
              url: `supplieraccount/${id}`,
              method: "DELETE",
          }),
      }),
  });