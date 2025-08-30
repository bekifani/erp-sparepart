
  export const unitEndpoints = (builder) => ({
      createUnit: builder.mutation({
          query: (data) => ({
              url: `unit`,
              method: "POST",
              body: data,
          }),
      }),
      editUnit: builder.mutation({
          query: (data) => ({
              url: `unit/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getUnits: builder.query({
        query: () => `unit`,
      }),
      getUnitDetail: builder.query({
          query: (id) => `unit/${id}`,
      }),
      deleteUnit: builder.mutation({
          query: (id) => ({
              url: `unit/${id}`,
              method: "DELETE",
          }),
      }),
  });