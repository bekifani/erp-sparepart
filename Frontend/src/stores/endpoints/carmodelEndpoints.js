
  export const carmodelEndpoints = (builder) => ({
      createCarmodel: builder.mutation({
          query: (data) => ({
              url: `carmodel`,
              method: "POST",
              body: data,
          }),
      }),
      editCarmodel: builder.mutation({
          query: (data) => ({
              url: `carmodel/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCarmodels: builder.query({
        query: () => `carmodel`,
      }),
      getCarmodelDetail: builder.query({
          query: (id) => `carmodel/${id}`,
      }),
      deleteCarmodel: builder.mutation({
          query: (id) => ({
              url: `carmodel/${id}`,
              method: "DELETE",
          }),
      }),
  });