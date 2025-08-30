interface User {
    id: string;
    name: string;
    email: string;
    // Add more user properties as needed
  }
  
  interface GetAuthUserResponse {
    data: User;
  }
  
  export const testEndpoints = (builder: any) => ({
    getAuthUser: builder.query({
      query: () => `get_user`,
    }),
  });