
  export const supplierEndpoints = (builder) => ({
      createSupplier: builder.mutation({
          query: (data) => ({
              url: `supplier`,
              method: "POST",
              body: data,
          }),
      }),
      editSupplier: builder.mutation({
          query: (data) => ({
              url: `supplier/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSuppliers: builder.query({
        query: () => `supplier`,
      }),
      getSupplierDetail: builder.query({
          query: (id) => `supplier/${id}`,
      }),
      deleteSupplier: builder.mutation({
          query: (id) => ({
              url: `supplier/${id}`,
              method: "DELETE",
          }),
      }),
  });