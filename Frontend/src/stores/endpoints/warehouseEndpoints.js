
  export const warehouseEndpoints = (builder) => ({
      createWarehouse: builder.mutation({
          query: (data) => ({
              url: `warehouse`,
              method: "POST",
              body: data,
          }),
      }),
      editWarehouse: builder.mutation({
          query: (data) => ({
              url: `warehouse/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getWarehouses: builder.query({
        query: () => `warehouse`,
      }),
      getWarehouseDetail: builder.query({
          query: (id) => `warehouse/${id}`,
      }),
      deleteWarehouse: builder.mutation({
          query: (id) => ({
              url: `warehouse/${id}`,
              method: "DELETE",
          }),
      }),
  });