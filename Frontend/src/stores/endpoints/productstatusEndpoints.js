
  export const productstatusEndpoints = (builder) => ({
      createProductstatus: builder.mutation({
          query: (data) => ({
              url: `productstatus`,
              method: "POST",
              body: data,
          }),
      }),
      editProductstatus: builder.mutation({
          query: (data) => ({
              url: `productstatus/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getProductstatuss: builder.query({
        query: () => `productstatus`,
      }),
      getProductstatusDetail: builder.query({
          query: (id) => `productstatus/${id}`,
      }),
      deleteProductstatus: builder.mutation({
          query: (id) => ({
              url: `productstatus/${id}`,
              method: "DELETE",
          }),
      }),
  });