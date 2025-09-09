
  export const warehouseaccountEndpoints = (builder) => ({
      createWarehouseaccount: builder.mutation({
          query: (data) => ({
              url: `warehouseaccount`,
              method: "POST",
              body: data,
          }),
      }),
      editWarehouseaccount: builder.mutation({
          query: (data) => ({
              url: `warehouseaccount/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getWarehouseaccounts: builder.query({
        query: () => `warehouseaccount`,
      }),
      getWarehouseaccountDetail: builder.query({
          query: (id) => `warehouseaccount/${id}`,
      }),
      deleteWarehouseaccount: builder.mutation({
          query: (id) => ({
              url: `warehouseaccount/${id}`,
              method: "DELETE",
          }),
      }),
  });