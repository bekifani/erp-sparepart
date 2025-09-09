
  export const supplierorderdetailEndpoints = (builder) => ({
      createSupplierorderdetail: builder.mutation({
          query: (data) => ({
              url: `supplierorderdetail`,
              method: "POST",
              body: data,
          }),
      }),
      editSupplierorderdetail: builder.mutation({
          query: (data) => ({
              url: `supplierorderdetail/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSupplierorderdetails: builder.query({
        query: () => `supplierorderdetail`,
      }),
      getSupplierorderdetailDetail: builder.query({
          query: (id) => `supplierorderdetail/${id}`,
      }),
      deleteSupplierorderdetail: builder.mutation({
          query: (id) => ({
              url: `supplierorderdetail/${id}`,
              method: "DELETE",
          }),
      }),
  });