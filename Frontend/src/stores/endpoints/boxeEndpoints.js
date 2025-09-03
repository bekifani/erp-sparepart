
  export const boxeEndpoints = (builder) => ({
      createBoxe: builder.mutation({
          query: (data) => ({
              url: `boxe`,
              method: "POST",
              body: data,
          }),
      }),
      editBoxe: builder.mutation({
          query: (data) => ({
              url: `boxe/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getBoxes: builder.query({
        query: () => `boxe`,
      }),
      getBoxeDetail: builder.query({
          query: (id) => `boxe/${id}`,
      }),
      deleteBoxe: builder.mutation({
          query: (id) => ({
              url: `boxe/${id}`,
              method: "DELETE",
          }),
      }),
      searchBoxe: builder.query({
          query: (searchTerm) => `search_boxe/${searchTerm}`,
      }),
  });