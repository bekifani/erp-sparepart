// import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
// // import { useAuthStore } from "../stores/auth";
// // import router from "../router";
// // import { toast } from "vue3-toastify";
// // import "vue3-toastify/dist/index.css";
// // import { useLoadingStore } from "../stores/loadingStore";

// const setup = () => {
// //   const loadingStore = useLoadingStore();

//   const instance = axios.create({
//     baseURL: "/", // Set your base API URL
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   // Request Interceptor
//   instance.interceptors.request.use(
//     (config: AxiosRequestConfig) => {
//       // Enable loading unless URL is 'live-schedule'
//       if (config.url && !config.url.includes("live-schedule")) {
//         loadingStore.isLoading = true;
//       }

//       const authStore = useAuthStore();
//       const token = authStore.access_token;
//       const isAuthenticated = authStore.getStatus;

//       // Add Authorization header for authenticated requests
//       if (token && isAuthenticated && config.url !== "/api/login") {
//         config.headers = {
//           ...config.headers,
//           Authorization: `Bearer ${token}`,
//         };
//       }

//       return config;
//     },
//     (error: AxiosError) => {
//       loadingStore.isLoading = false;
//       return Promise.reject(error);
//     }
//   );

//   // Response Interceptor
//   instance.interceptors.response.use(
//     (response: AxiosResponse) => {
//       loadingStore.isLoading = false;
//       return response;
//     },
//     async (error: AxiosError) => {
//       loadingStore.isLoading = false;
//       const originalConfig = error.config;

//       if (originalConfig?.url !== "/api/login" && error.response) {
//         const status = error.response.status;

//         if (status === 401) {
//           const authStore = useAuthStore();
//           authStore.logout();

//           try {
//             await router.push("/login");
//           } catch (routingError) {
//             console.error("Routing error:", routingError);
//           }
//         }

//         // Show error message
//         toast.error(error.response.data?.message || "An error occurred", {
//           position: toast.POSITION.TOP_RIGHT,
//           transition: toast.TRANSITIONS.SLIDE,
//           hideProgressBar: true,
//           toastClassName: "dark:bg-gray-800 dark:text-white",
//         });

//         // Iterate through validation errors
//         const errorMessages = Object.values(error.response.data?.data || {});
//         errorMessages.forEach((message) => {
//           toast.info(message as string, {
//             position: toast.POSITION.TOP_RIGHT,
//             transition: toast.TRANSITIONS.SLIDE,
//             hideProgressBar: true,
//             toastClassName: "dark:bg-gray-800 dark:text-white",
//           });
//         });
//       }

//       return Promise.reject(error);
//     }
//   );

//   return instance;
// };

// export default setup;
