
  export const expenseEndpoints = (builder) => ({
      createExpense: builder.mutation({
          query: (data) => ({
              url: `expense`,
              method: "POST",
              body: data,
          }),
      }),
      editExpense: builder.mutation({
          query: (data) => ({
              url: `expense/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getExpenses: builder.query({
        query: () => `expense`,
      }),
      getExpenseDetail: builder.query({
          query: (id) => `expense/${id}`,
      }),
      deleteExpense: builder.mutation({
          query: (id) => ({
              url: `expense/${id}`,
              method: "DELETE",
          }),
      }),
  });