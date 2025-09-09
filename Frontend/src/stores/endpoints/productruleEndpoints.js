
  export const productruleEndpoints = (builder) => ({
      createProductrule: builder.mutation({
          query: (data) => ({
              url: `productrule`,
              method: "POST",
              body: data,
          }),
      }),
      editProductrule: builder.mutation({
          query: (data) => ({
              url: `productrule/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getProductrules: builder.query({
        query: () => `productrule`,
      }),
      getProductruleDetail: builder.query({
          query: (id) => `productrule/${id}`,
      }),
      deleteProductrule: builder.mutation({
          query: (id) => ({
              url: `productrule/${id}`,
              method: "DELETE",
          }),
      }),
  });