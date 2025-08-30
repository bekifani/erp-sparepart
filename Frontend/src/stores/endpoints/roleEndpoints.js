
  export const roleEndpoints = (builder) => ({
      createRole: builder.mutation({
          query: (data) => ({
              url: `role`,
              method: "POST",
              body: data,
          }),
      }),
      editRole: builder.mutation({
          query: (data) => ({
              url: `role/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getRoles: builder.query({
        query: () => `role`,
      }),
      getRoleDetail: builder.query({
          query: (id) => `role/${id}`,
      }),
      deleteRole: builder.mutation({
          query: (id) => ({
              url: `role/${id}`,
              method: "DELETE",
          }),
      }),
  });