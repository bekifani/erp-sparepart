export const currencyEndpoints = (builder) => ({
    createCurrency: builder.mutation({
        query: (data) => ({
            url: `currency`,
            method: "POST",
            body: data,
        }),
    }),
    editCurrency: builder.mutation({
        query: (data) => ({
            url: `currency/${data.id}`,
            method: "PUT",
            body: data,
        }),
    }),
    getCurrencies: builder.query({
        query: () => `currency`,
    }),
    getCurrencyDetail: builder.query({
        query: (id) => `currency/${id}`,
    }),
    deleteCurrency: builder.mutation({
        query: (id) => ({
            url: `currency/${id}`,
            method: "DELETE",
        }),
    }),
    getAllCurrencies: builder.query({
        query: () => `all_currencies`,
    }),
    toggleCurrency: builder.mutation({
        query: (id) => ({
            url: `currency/${id}/toggle`,
            method: "POST",
        }),
    }),
    searchCurrency: builder.query({
        query: (searchTerm) => `search_currency/${searchTerm}`,
    }),
});
