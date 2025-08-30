
  export const productEndpoints = (builder) => ({
      createProduct: builder.mutation({
          query: (data) => ({
              url: `product`,
              method: "POST",
              body: data,
          }),
      }),
      editProduct: builder.mutation({
          query: (data) => ({
              url: `product/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getProducts: builder.query({
        query: () => `product`,
      }),
      getProductDetail: builder.query({
          query: (id) => `product/${id}`,
      }),
      deleteProduct: builder.mutation({
          query: (id) => ({
              url: `product/${id}`,
              method: "DELETE",
          }),
      }),
  });