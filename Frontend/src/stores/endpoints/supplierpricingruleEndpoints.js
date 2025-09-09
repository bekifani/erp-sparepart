
  export const supplierpricingruleEndpoints = (builder) => ({
      createSupplierpricingrule: builder.mutation({
          query: (data) => ({
              url: `supplierpricingrule`,
              method: "POST",
              body: data,
          }),
      }),
      editSupplierpricingrule: builder.mutation({
          query: (data) => ({
              url: `supplierpricingrule/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSupplierpricingrules: builder.query({
        query: () => `supplierpricingrule`,
      }),
      getSupplierpricingruleDetail: builder.query({
          query: (id) => `supplierpricingrule/${id}`,
      }),
      deleteSupplierpricingrule: builder.mutation({
          query: (id) => ({
              url: `supplierpricingrule/${id}`,
              method: "DELETE",
          }),
      }),
  });