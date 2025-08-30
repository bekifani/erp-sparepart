
  export const specificationheadnameEndpoints = (builder) => ({
      createSpecificationheadname: builder.mutation({
          query: (data) => ({
              url: `specificationheadname`,
              method: "POST",
              body: data,
          }),
      }),
      editSpecificationheadname: builder.mutation({
          query: (data) => ({
              url: `specificationheadname/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSpecificationheadnames: builder.query({
        query: () => `specificationheadname`,
      }),
      getSpecificationheadnameDetail: builder.query({
          query: (id) => `specificationheadname/${id}`,
      }),
      deleteSpecificationheadname: builder.mutation({
          query: (id) => ({
              url: `specificationheadname/${id}`,
              method: "DELETE",
          }),
      }),
  });