import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authenticationEndpoints } from './endpoints/authenticationEndpoints.js'
import { employeeEndpoints } from "./endpoints/employeeEndpoints"
import { communicationEndpoints } from "./endpoints/communicationEndpoints"
import { userEndpoints } from "./endpoints/userEndpoints"
import { roleEndpoints } from "./endpoints/roleEndpoints.js"
import { dashboardEndpoints } from "./endpoints/dashboardEndpoints.js";
import { publicEndpoints } from "./endpoints/PublicEndpoints"
import { RootState } from './store';

export const apiSlice = createApi({
    reducerPath: "user",
    baseQuery: fetchBaseQuery({
      baseUrl: "http://localhost:8000/api/",
      credentials: "include",
      prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const csrf_token = state.auth.csrf_token;
        headers.set("X-Tenant", state.auth.tenant);
        headers.set("X-CSRF-TOKEN", csrf_token);
        headers.set("Accept-Language", state.auth.lang);
        if(state.auth.isAuthenticated){
          const token = state.auth.token;
          headers.set("Authorization", `Bearer ${token}`);
          return headers;
        }
        return headers;
      },
    }),
    endpoints: (builder) => ({
        ...authenticationEndpoints(builder),   
        ...employeeEndpoints(builder),
        ...userEndpoints(builder),
        ...roleEndpoints(builder),
        ...dashboardEndpoints(builder),
        ...communicationEndpoints(builder),
        ...publicEndpoints(builder),
        //disperse here
    }),
});


export const {
    //Authentication Section
    useLoginUserMutation,
    useSignUpUserMutation,
    useLogoutUserMutation,
    useGetAuthenticatedUserQuery,
    useGetPasswordResetPinMutation,
    useGetResendPasswordResetPinMutation,
    useResetPasswordMutation,
    useGetCsrfTokenQuery,
    useChangePasswordMutation,
    
    useCreateEmployeeMutation,
    useEditEmployeeMutation,
    useGetEmployeeDetailQuery,
    useLazyGetEmployeeDetailQuery,
    useDeleteEmployeeMutation,
    useGetEmployeesQuery,
    useTerminateEmployeeMutation,
    useActivateEmployeeAccountMutation,
    
    useCreateUserMutation,
    useEditUserMutation,
    useGetUserDetailQuery,
    useLazyGetUserDetailQuery,
    useDeleteUserMutation,
    useGetUsersQuery,
    useResetUserPasswordMutation,

    useCreateRoleMutation,
    useEditRoleMutation,
    useGetRoleDetailQuery,
    useLazyGetRoleDetailQuery,
    useDeleteRoleMutation,
    useGetRolesQuery,

    useGetGeneralDashboardDataQuery,
    useGetCustomerReportQuery,
    useGetCustomerDetailReportQuery,
    useGetExpenseReportQuery,
    useGetPaymentReportQuery,
    useGetProfitReportQuery,
    useGetSupplierReportQuery, 
    useGetWarehouseReportQuery,
    useGetShopReportQuery,
    useGetSalesReportQuery,
    useGetProdcutReportQuery,
    useSendTestNotificationQuery,

    
    useGetNotificationsQuery,
    useMarkAsReadMutation,


    //useCreateSectorMutation,
    //useEditSectorMutation,
    //useGetSectorDetailQuery,
    //useLazyGetSectorDetailQuery,
    //useDeleteSectorMutation,
    //useGetSectorsQuery,


    //useCreateCategorieMutation,
    //useEditCategorieMutation,
    //useGetCategorieDetailQuery,
    //useLazyGetCategorieDetailQuery,
    //useDeleteCategorieMutation,
    //useGetCategoriesQuery,


    //useCreateCompanMutation,
    //useEditCompanMutation,
    //useGetCompanDetailQuery,
    useLazyGetCompanDetailQuery,
    useDeleteCompanMutation,
    useGetCompansQuery,
    useGetMyCompanyQuery,


    //useCreateAddresstypeMutation,
    //useEditAddresstypeMutation,
    //useGetAddresstypeDetailQuery,
    //useLazyGetAddresstypeDetailQuery,
    //useDeleteAddresstypeMutation,
    //useGetAddresstypesQuery,


    //useCreateAddressbookMutation,
    //useEditAddressbookMutation,
    //useGetAddressbookDetailQuery,
    //useLazyGetAddressbookDetailQuery,
    //useDeleteAddressbookMutation,
    useGetAddressbooksQuery,  


    //useCreateAdMutation,
    //useEditAdMutation,
    //useGetAdDetailQuery,
    useLazyGetAdDetailQuery,
    useDeleteAdMutation,
    useGetAdsQuery,


    useCreateContactMutation,
    useEditContactMutation,
    useGetContactDetailQuery,
    useLazyGetContactDetailQuery,
    useDeleteContactMutation,
    useGetContactsQuery,


    useCreateSponsorMutation,
    useEditSponsorMutation,
    useGetSponsorDetailQuery,
    useLazyGetSponsorDetailQuery,
    useDeleteSponsorMutation,
    useGetSponsorsQuery,


    useCreateSettingMutation,
    useEditSettingMutation,
    useGetSettingDetailQuery,
    useLazyGetSettingDetailQuery,
    useDeleteSettingMutation,
    useGetSettingsQuery,

    //add here  
    useGetLandingPageQuery,
    useGetSectorsListQuery,
    useGetSectorCategoriesQuery,
    useGetCategoryCompaniesQuery,
    useSearchCompaniesMutation,
    useGetPublicCompanyDetailQuery,
    useUpdateCompanyAdsMutation,
    useAddPageViewQuery,
    useGetPageViewsQuery
} = apiSlice