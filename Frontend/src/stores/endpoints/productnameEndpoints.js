
  export const productnameEndpoints = (builder) => ({
      createProductname: builder.mutation({
          query: (data) => ({
              url: `productname`,
              method: "POST",
              body: data,
          }),
      }),
      editProductname: builder.mutation({
          query: (data) => ({
              url: `productname/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getProductnames: builder.query({
        query: () => `productname`,
      }),
      getProductnameDetail: builder.query({
          query: (id) => `productname/${id}`,
      }),
      deleteProductname: builder.mutation({
          query: (id) => ({
              url: `productname/${id}`,
              method: "DELETE",
          }),
      }),
      searchProductname: builder.query({
          query: (searchTerm) => `search_productname/${searchTerm}`,
      }),
  });