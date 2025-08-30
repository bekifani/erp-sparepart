
  export const productspecificationEndpoints = (builder) => ({
      createProductspecification: builder.mutation({
          query: (data) => ({
              url: `productspecification`,
              method: "POST",
              body: data,
          }),
      }),
      editProductspecification: builder.mutation({
          query: (data) => ({
              url: `productspecification/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getProductspecifications: builder.query({
        query: () => `productspecification`,
      }),
      getProductspecificationDetail: builder.query({
          query: (id) => `productspecification/${id}`,
      }),
      deleteProductspecification: builder.mutation({
          query: (id) => ({
              url: `productspecification/${id}`,
              method: "DELETE",
          }),
      }),
  });