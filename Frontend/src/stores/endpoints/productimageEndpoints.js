
  export const productimageEndpoints = (builder) => ({
      createProductimage: builder.mutation({
          query: (data) => ({
              url: `productimage`,
              method: "POST",
              body: data,
          }),
      }),
      editProductimage: builder.mutation({
          query: (data) => ({
              url: `productimage/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getProductimages: builder.query({
        query: () => `productimage`,
      }),
      getProductimageDetail: builder.query({
          query: (id) => `productimage/${id}`,
      }),
      deleteProductimage: builder.mutation({
          query: (id) => ({
              url: `productimage/${id}`,
              method: "DELETE",
          }),
      }),
  });