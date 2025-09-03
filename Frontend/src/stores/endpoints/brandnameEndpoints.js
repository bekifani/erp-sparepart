
  export const brandnameEndpoints = (builder) => ({
      createBrandname: builder.mutation({
          query: (data) => ({
              url: `brandname`,
              method: "POST",
              body: data,
          }),
      }),
      editBrandname: builder.mutation({
          query: (data) => ({
              url: `brandname/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getBrandnames: builder.query({
        query: () => `brandname`,
      }),
      getBrandnameDetail: builder.query({
          query: (id) => `brandname/${id}`,
      }),
      deleteBrandname: builder.mutation({
          query: (id) => ({
              url: `brandname/${id}`,
              method: "DELETE",
          }),
      }),
      searchBrandname: builder.query({
          query: (searchTerm) => `search_brandname/${searchTerm}`,
      }),
  });