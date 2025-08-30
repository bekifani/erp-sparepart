
  export const sectorEndpoints = (builder) => ({
      createSector: builder.mutation({
          query: (data) => ({
              url: `sector`,
              method: "POST",
              body: data,
          }),
      }),
      editSector: builder.mutation({
          query: (data) => ({
              url: `sector/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSectors: builder.query({
        query: () => `sector`,
      }),
      getSectorDetail: builder.query({
          query: (id) => `sector/${id}`,
      }),
      deleteSector: builder.mutation({
          query: (id) => ({
              url: `sector/${id}`,
              method: "DELETE",
          }),
      }),
  });