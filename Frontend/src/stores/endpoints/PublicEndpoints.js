export const publicEndpoints = (builder) => ({
    // Get landing page data
    getLandingPage: builder.query({
        query: () => ({
            url: '/public/landing-page',
            method: 'GET'
        })
    }),

    // Get all categories
    getSectorsList: builder.query({
        query: () => ({
            url: '/public/categories',
            method: 'GET'
        })
    }),

    // Get categories by sector ID
    getSectorCategories: builder.query({
        query: (sectorId) => ({
            url: `/public/sector/${sectorId}/categories`,
            method: 'GET'
        })
    }),

    // Get companies by category ID
    getCategoryCompanies: builder.query({
        query: ({id, currentPage}) => ({
            url: `/public/category/${id}/companies?page=${currentPage}`,
            method: 'GET'
        })
    }),

    // Search companies
    searchCompanies: builder.mutation({
        query: (data) => ({
            url: `/public/companies/search?page=${data.page}`,
            method: 'POST',
            body: {"name": data.query} 
        })
    }),

    getPublicCompanyDetail: builder.query({
        query: (companyId) => ({
            url: `/public/company/${companyId}`,
            method: 'GET'
        })
    }),

    addPageView: builder.query({
        query: () => ({
            url: `/public/add_view`,
            method: 'GET'
        })
    }),

    getPageViews: builder.query({
        query: () => ({
            url: `/public/get_views`,
            method: 'GET'
        })
    })
});