
  export const importorderEndpoints = (builder) => ({
      createImportorder: builder.mutation({
          query: (data) => ({
              url: `importorder`,
              method: "POST",
              body: data,
          }),
      }),
      editImportorder: builder.mutation({
          query: (data) => ({
              url: `importorder/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getImportorders: builder.query({
        query: () => `importorder`,
      }),
      getImportorderDetail: builder.query({
          query: (id) => `importorder/${id}`,
      }),
      deleteImportorder: builder.mutation({
          query: (id) => ({
              url: `importorder/${id}`,
              method: "DELETE",
          }),
      }),
      updateOrderStatus: builder.mutation({
        query: (data) => ({
            url: `update_status`,
            method: "POST",
            body: data,
        }),
      }),
      uploadDeliveryPackages: builder.mutation({
        query: (data) => ({
            url: `upload_delivery`,
            method: "POST",
            body: data,
        }),
      }),
  });