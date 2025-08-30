
  export const crosscarEndpoints = (builder) => ({
      createCrosscar: builder.mutation({
          query: (data) => ({
              url: `crosscar`,
              method: "POST",
              body: data,
          }),
      }),
      editCrosscar: builder.mutation({
          query: (data) => ({
              url: `crosscar/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCrosscars: builder.query({
        query: () => `crosscar`,
      }),
      getCrosscarDetail: builder.query({
          query: (id) => `crosscar/${id}`,
      }),
      deleteCrosscar: builder.mutation({
          query: (id) => ({
              url: `crosscar/${id}`,
              method: "DELETE",
          }),
      }),
  });