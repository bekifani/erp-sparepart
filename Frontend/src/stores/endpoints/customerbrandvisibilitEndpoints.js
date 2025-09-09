
  export const customerbrandvisibilitEndpoints = (builder) => ({
      createCustomerbrandvisibilit: builder.mutation({
          query: (data) => ({
              url: `customerbrandvisibilit`,
              method: "POST",
              body: data,
          }),
      }),
      editCustomerbrandvisibilit: builder.mutation({
          query: (data) => ({
              url: `customerbrandvisibilit/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCustomerbrandvisibilits: builder.query({
        query: () => `customerbrandvisibilit`,
      }),
      getCustomerbrandvisibilitDetail: builder.query({
          query: (id) => `customerbrandvisibilit/${id}`,
      }),
      deleteCustomerbrandvisibilit: builder.mutation({
          query: (id) => ({
              url: `customerbrandvisibilit/${id}`,
              method: "DELETE",
          }),
      }),
  });