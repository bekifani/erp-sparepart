
  export const packagingproblemEndpoints = (builder) => ({
      createPackagingproblem: builder.mutation({
          query: (data) => ({
              url: `packagingproblem`,
              method: "POST",
              body: data,
          }),
      }),
      editPackagingproblem: builder.mutation({
          query: (data) => ({
              url: `packagingproblem/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getPackagingproblems: builder.query({
        query: () => `packagingproblem`,
      }),
      getPackagingproblemDetail: builder.query({
          query: (id) => `packagingproblem/${id}`,
      }),
      deletePackagingproblem: builder.mutation({
          query: (id) => ({
              url: `packagingproblem/${id}`,
              method: "DELETE",
          }),
      }),
  });