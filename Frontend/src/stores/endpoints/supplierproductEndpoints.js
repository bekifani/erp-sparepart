
  export const supplierproductEndpoints = (builder) => ({
      createSupplierproduct: builder.mutation({
          query: (data) => ({
              url: `supplierproduct`,
              method: "POST",
              body: data,
          }),
      }),
      editSupplierproduct: builder.mutation({
          query: (data) => ({
              url: `supplierproduct/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSupplierproducts: builder.query({
        query: () => `supplierproduct`,
      }),
      getSupplierproductDetail: builder.query({
          query: (id) => `supplierproduct/${id}`,
      }),
      deleteSupplierproduct: builder.mutation({
          query: (id) => ({
              url: `supplierproduct/${id}`,
              method: "DELETE",
          }),
      }),
  });