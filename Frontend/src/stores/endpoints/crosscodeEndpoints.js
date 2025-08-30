
  export const crosscodeEndpoints = (builder) => ({
      createCrosscode: builder.mutation({
          query: (data) => ({
              url: `crosscode`,
              method: "POST",
              body: data,
          }),
      }),
      editCrosscode: builder.mutation({
          query: (data) => ({
              url: `crosscode/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCrosscodes: builder.query({
        query: () => `crosscode`,
      }),
      getCrosscodeDetail: builder.query({
          query: (id) => `crosscode/${id}`,
      }),
      deleteCrosscode: builder.mutation({
          query: (id) => ({
              url: `crosscode/${id}`,
              method: "DELETE",
          }),
      }),
  });