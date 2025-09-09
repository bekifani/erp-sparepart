
  export const fileoperationEndpoints = (builder) => ({
      createFileoperation: builder.mutation({
          query: (data) => ({
              url: `fileoperation`,
              method: "POST",
              body: data,
          }),
      }),
      editFileoperation: builder.mutation({
          query: (data) => ({
              url: `fileoperation/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getFileoperations: builder.query({
        query: () => `fileoperation`,
      }),
      getFileoperationDetail: builder.query({
          query: (id) => `fileoperation/${id}`,
      }),
      deleteFileoperation: builder.mutation({
          query: (id) => ({
              url: `fileoperation/${id}`,
              method: "DELETE",
          }),
      }),
  });