
  export const supplierorderEndpoints = (builder) => ({
      createSupplierorder: builder.mutation({
          query: (data) => ({
              url: `supplierorder`,
              method: "POST",
              body: data,
          }),
      }),
      editSupplierorder: builder.mutation({
          query: (data) => ({
              url: `supplierorder/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSupplierorders: builder.query({
        query: () => `supplierorder`,
      }),
      getSupplierorderDetail: builder.query({
          query: (id) => `supplierorder/${id}`,
      }),
      deleteSupplierorder: builder.mutation({
          query: (id) => ({
              url: `supplierorder/${id}`,
              method: "DELETE",
          }),
      }),
  });