
  export const productinformationEndpoints = (builder) => ({
      createProductinformation: builder.mutation({
          query: (data) => ({
              url: `productinformation`,
              method: "POST",
              body: data,
          }),
      }),
      editProductinformation: builder.mutation({
          query: (data) => ({
              url: `productinformation/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getProductinformations: builder.query({
        query: () => `productinformation`,
      }),
      getProductinformationDetail: builder.query({
          query: (id) => `productinformation/${id}`,
      }),
      deleteProductinformation: builder.mutation({
          query: (id) => ({
              url: `productinformation/${id}`,
              method: "DELETE",
          }),
      }),
  });