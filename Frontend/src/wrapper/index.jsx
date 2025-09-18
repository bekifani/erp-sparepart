import { useGetCsrfTokenQuery } from "@/stores/apiSlice";
import { setCSRFToken } from "@/stores/authReducer";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import LanguageSelector from "@/components/LanguageSelector";
import Pusher from "pusher-js";
// import GlobalListener from "./GlobalListener";
const WrapperComponent = ({ children }) => {
    const dispatch = useDispatch()
    const { data: token , isLoading: loading, isSuccess } = useGetCsrfTokenQuery();
    useEffect(()=>{
        const csrf_token = token?.data?.csrf_token;
        console.log(token, 'is token')
        if(csrf_token){
            console.log(csrf_token)
            dispatch(setCSRFToken(csrf_token))
        }
    },[token]);

    
  return <div className="dark:bg-gray-800 bg-gray-100">
    {/* <GlobalListener /> */}
    {children}
    </div>
};

export default WrapperComponent;