// import instance from "./api";
// import { useAuthStore } from "../stores/auth";
// import router from "../router/index";
// import { toast } from 'vue3-toastify';
// import { useLoadingStore } from "../stores/loadingStore";

// const setup = (): void => {
//   const loading_store = useLoadingStore();
  
//   // Intercepting requests
//   instance.interceptors.request.use(
//     (config) => {
//       if (config.url?.includes('groupMessage') || config.url?.includes('messages') || config.url?.includes('sendMessage')) {
//         loading_store.isLoading = false;
//       } else {
//         loading_store.isLoading = true;
//       }

//       const authStore = useAuthStore();
//       const token = authStore.access_token;
//       const is_authenticated = authStore.getStatus;

//       if (token && is_authenticated && config.url !== '/api/login') {
//         config.headers["Authorization"] = 'Bearer ' + token;
//       }

//       return config;
//     },
//     (error) => {
//       loading_store.isLoading = false;
//       return Promise.reject(error);
//     }
//   );

//   // Intercepting responses
//   instance.interceptors.response.use(
//     (res) => {
//       loading_store.isLoading = false;
//       // Uncomment this block to show success toast
//       // toast.success(res.data.message, {
//       //   position: toast.POSITION.TOP_RIGHT,
//       //   transition: toast.TRANSITIONS.SLIDE,
//       //   hideProgressBar: true,
//       //   toastClassName: 'dark:bg-gray-800 dark:text-white'
//       // });
//       return res;
//     },
//     async (err) => {
//       loading_store.isLoading = false;
//       const originalConfig = err.config;

//       if (originalConfig.url !== "/api/login" && err.response) {
//         // Access Token was expired
//         console.log(err.response.status);

//         if (err.response.status === 401) {
//           const authStore = useAuthStore();
//           authStore.logout();

//           try {
//             router.push("/login");
//           } catch (error) {
//             console.error(error);
//           }
//         }

//         toast.error(err.response.data.message, {
//           position: toast.POSITION.TOP_RIGHT,
//           transition: toast.TRANSITIONS.SLIDE,
//           hideProgressBar: true,
//           toastClassName: 'dark:bg-gray-800 dark:text-white'
//         });

//         const error_values = Object.values(err.response.data.data);
//         for (const value of error_values) {
//           toast.info(value, {
//             position: toast.POSITION.TOP_RIGHT,
//             transition: toast.TRANSITIONS.SLIDE,
//             hideProgressBar: true,
//             toastClassName: 'dark:bg-gray-800 dark:text-white'
//           });
//         }
//       }

//       return Promise.reject(err);
//     }
//   );
// };

// export default setup;
