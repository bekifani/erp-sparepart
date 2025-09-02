
  export const productinformationEndpoints = (builder) => ({
      createProductinformation: builder.mutation({
          query: (data) => ({
              url: `ProductInformation`,
              method: "POST",
              body: data,
          }),
      }),
      editProductinformation: builder.mutation({
          query: (data) => ({
              url: `ProductInformation/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getProductinformations: builder.query({
        query: () => `ProductInformation`,
      }),
      getProductinformationDetail: builder.query({
          query: (id) => `ProductInformation/${id}`,
      }),
      deleteProductinformation: builder.mutation({
          query: (id) => ({
              url: `ProductInformation/${id}`,
              method: "DELETE",
          }),
      }),
  });