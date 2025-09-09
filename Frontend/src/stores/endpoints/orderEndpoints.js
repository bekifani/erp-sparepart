
  export const orderEndpoints = (builder) => ({
      createOrder: builder.mutation({
          query: (data) => ({
              url: `order`,
              method: "POST",
              body: data,
          }),
      }),
      editOrder: builder.mutation({
          query: (data) => ({
              url: `order/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getOrders: builder.query({
        query: () => `order`,
      }),
      getOrderDetail: builder.query({
          query: (id) => `order/${id}`,
      }),
      deleteOrder: builder.mutation({
          query: (id) => ({
              url: `order/${id}`,
              method: "DELETE",
          }),
      }),
  });