
  export const labelEndpoints = (builder) => ({
      createLabel: builder.mutation({
          query: (data) => ({
              url: `label`,
              method: "POST",
              body: data,
          }),
      }),
      editLabel: builder.mutation({
          query: (data) => ({
              url: `label/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getLabels: builder.query({
        query: () => `label`,
      }),
      getLabelDetail: builder.query({
          query: (id) => `label/${id}`,
      }),
      deleteLabel: builder.mutation({
          query: (id) => ({
              url: `label/${id}`,
              method: "DELETE",
          }),
      }),
  });