
  export const categorEndpoints = (builder) => ({
      createCategor: builder.mutation({
          query: (data) => ({
              url: `categor`,
              method: "POST",
              body: data,
          }),
      }),
      editCategor: builder.mutation({
          query: (data) => ({
              url: `categor/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCategors: builder.query({
        query: () => `categor`,
      }),
      getCategorDetail: builder.query({
          query: (id) => `categor/${id}`,
      }),
      deleteCategor: builder.mutation({
          query: (id) => ({
              url: `categor/${id}`,
              method: "DELETE",
          }),
      }),
  });