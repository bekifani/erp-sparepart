
  export const employeeEndpoints = (builder) => ({
      createEmployee: builder.mutation({
          query: (data) => ({
              url: `employee`,
              method: "POST",
              body: data,
          }),
      }),
      editEmployee: builder.mutation({
          query: (data) => ({
              url: `employee/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getEmployees: builder.query({
        query: () => `employee`,
      }),
      getEmployeeDetail: builder.query({
          query: (id) => `employee/${id}`,
      }),
      deleteEmployee: builder.mutation({
          query: (id) => ({
              url: `employee/${id}`,
              method: "DELETE",
          }),
      }),
    terminateEmployee: builder.mutation({
        query: (id) => ({
            url: `terminate-employee/${id}`,
            method: "POST",
        }),
        }),
    activateEmployeeAccount: builder.mutation({
            query: (id) => ({
                url: `activate-employee-account/${id}`,
                method: "POST",
            }),
            }),
  });