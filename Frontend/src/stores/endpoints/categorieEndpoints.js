
  export const categorieEndpoints = (builder) => ({
      createCategorie: builder.mutation({
          query: (data) => ({
              url: `categorie`,
              method: "POST",
              body: data,
          }),
      }),
      editCategorie: builder.mutation({
          query: (data) => ({
              url: `categorie/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCategories: builder.query({
        query: () => `categorie`,
      }),
      getCategorieDetail: builder.query({
          query: (id) => `categorie/${id}`,
      }),
      deleteCategorie: builder.mutation({
          query: (id) => ({
              url: `categorie/${id}`,
              method: "DELETE",
          }),
      }),
      searchCategorie: builder.query({
          query: (searchTerm) => `search_categor/${searchTerm}`,
      }),
  });