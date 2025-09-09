
  export const problemEndpoints = (builder) => ({
      createProblem: builder.mutation({
          query: (data) => ({
              url: `problem`,
              method: "POST",
              body: data,
          }),
      }),
      editProblem: builder.mutation({
          query: (data) => ({
              url: `problem/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getProblems: builder.query({
        query: () => `problem`,
      }),
      getProblemDetail: builder.query({
          query: (id) => `problem/${id}`,
      }),
      deleteProblem: builder.mutation({
          query: (id) => ({
              url: `problem/${id}`,
              method: "DELETE",
          }),
      }),
  });