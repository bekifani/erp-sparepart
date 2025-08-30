// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Pusher from "pusher-js";
// import Notification from "@/components/Base/Notification";
// import Lucide from "@/components/Base/Lucide";
// function GlobalListener() {
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const user = useSelector((state) => state.auth.user);
//   const token = useSelector((state) => state.auth.token);
//   const tenant = useSelector((state) => state.auth.tenant);
//   const csrf_token = useSelector((state) => state.auth.csrf_token)
//   const app_url = useSelector((state) => state.auth.app_url)
//   const lang = useSelector((state) => state.auth.lang)
//   const dispatch = useDispatch();
//   const [pushed_messages, setPushedMessages] = useState([]);
//   const [showToast, setShowToast] = useState(false);
//   const [toastContent, setToastcontent] = useState("");
//   let pusher, channel;
//   const successNotification = useRef();

//   const handleNotificationSent = (data) => {
//     const sound = new Audio('/notification.wav');  // Provide the correct path
//     sound.play(); 
//     setToastcontent(data.message)
//     successNotification.current?.showToast();
//   };

//   useEffect(() => {
//     const fetchCsrfToken = async () => {
//       try {
//         if (dispatch) {
//           if (isAuthenticated) {
//             pusher = new Pusher("d9721b9396820ae1b4f9", {
//               cluster: 'eu',
//               encrypted: true,
//               authEndpoint: `${app_url}/api/broadcasting/auth`,
//               auth: {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                   "X-Tenant": tenant,
//                   "X-CSRF-TOKEN": csrf_token,
//                   "Accept-Language": lang,
//                 },
//               },
//             });

//             const channelName = `private-App.Models.User.${user.user.id}`;
//             channel = pusher.subscribe(channelName);
//             // channel.bind("App\\Events\\MessageSent", handleMessageSent);
//             channel.bind("user.notification", handleNotificationSent);

//             // Error handling
//             pusher.connection.bind("error", (err) => {
//               console.error("Pusher error:", err.error || "Unknown error");
//             });

//             channel.bind("pusher:subscription_error", (statusCode) => {
//               console.error(`Subscription error: ${statusCode}`);
//             });
//           }
//         }
//       } catch (error) {
//         console.error(error, "is error");
//       }
//     };
//     fetchCsrfToken();
//     return () => {
//       if (channel) {
//         channel.unbind("App\\Events\\MessageSent");
//         channel.unbind(
//           "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated"
//         );
//         pusher.unsubscribe(`private-App.Models.User.${user?.id}`);
//       }
//     };
//   }, [isAuthenticated]);

//   return (
//     <div>
//       <div className="text-center">
//         <Notification
//           getRef={(el) => {
//             successNotification.current = el;
//           }}
//           className="flex"
//         >
//           <Lucide icon="Info" className="text-success" />
//           <div className="ml-4 mr-4">
//             <div className="font-medium">{toastContent}</div>
//             {/* <div className="mt-1 text-slate-500">
//                 The message will be sent in 5 minutes.
//             </div> */}
//           </div>
//         </Notification>
//       </div>
//     </div>
//   );
// }

// export default GlobalListener;
