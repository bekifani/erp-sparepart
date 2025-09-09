
  export const producthistorEndpoints = (builder) => ({
      createProducthistor: builder.mutation({
          query: (data) => ({
              url: `producthistor`,
              method: "POST",
              body: data,
          }),
      }),
      editProducthistor: builder.mutation({
          query: (data) => ({
              url: `producthistor/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getProducthistors: builder.query({
        query: () => `producthistor`,
      }),
      getProducthistorDetail: builder.query({
          query: (id) => `producthistor/${id}`,
      }),
      deleteProducthistor: builder.mutation({
          query: (id) => ({
              url: `producthistor/${id}`,
              method: "DELETE",
          }),
      }),
  });