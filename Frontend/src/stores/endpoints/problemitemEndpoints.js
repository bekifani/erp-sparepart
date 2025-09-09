
  export const problemitemEndpoints = (builder) => ({
      createProblemitem: builder.mutation({
          query: (data) => ({
              url: `problemitem`,
              method: "POST",
              body: data,
          }),
      }),
      editProblemitem: builder.mutation({
          query: (data) => ({
              url: `problemitem/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getProblemitems: builder.query({
        query: () => `problemitem`,
      }),
      getProblemitemDetail: builder.query({
          query: (id) => `problemitem/${id}`,
      }),
      deleteProblemitem: builder.mutation({
          query: (id) => ({
              url: `problemitem/${id}`,
              method: "DELETE",
          }),
      }),
  });