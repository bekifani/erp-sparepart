
  export const orderdetailEndpoints = (builder) => ({
      createOrderdetail: builder.mutation({
          query: (data) => ({
              url: `orderdetail`,
              method: "POST",
              body: data,
          }),
      }),
      editOrderdetail: builder.mutation({
          query: (data) => ({
              url: `orderdetail/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getOrderdetails: builder.query({
        query: () => `orderdetail`,
      }),
      getOrderdetailDetail: builder.query({
          query: (id) => `orderdetail/${id}`,
      }),
      deleteOrderdetail: builder.mutation({
          query: (id) => ({
              url: `orderdetail/${id}`,
              method: "DELETE",
          }),
      }),
  });