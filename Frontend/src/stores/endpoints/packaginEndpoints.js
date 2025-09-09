
  export const packaginEndpoints = (builder) => ({
      createPackagin: builder.mutation({
          query: (data) => ({
              url: `packagin`,
              method: "POST",
              body: data,
          }),
      }),
      editPackagin: builder.mutation({
          query: (data) => ({
              url: `packagin/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getPackagins: builder.query({
        query: () => `packagin`,
      }),
      getPackaginDetail: builder.query({
          query: (id) => `packagin/${id}`,
      }),
      deletePackagin: builder.mutation({
          query: (id) => ({
              url: `packagin/${id}`,
              method: "DELETE",
          }),
      }),
  });