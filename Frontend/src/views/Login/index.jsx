import { FormCheck, FormInput, FormLabel } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import Button from "@/components/Base/Button";
import Alert from "@/components/Base/Alert";
import Lucide from "@/components/Base/Lucide";
import clsx from "clsx";
import _ from "lodash";
import ThemeSwitcher from "@/components/ThemeSwitcher/index.tsx";
import { useForm } from "react-hook-form";
import Toastify from "toastify-js";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Notification from "@/components/Base/Notification";
import {
  FormSwitch,
  FormTextarea,
} from "@/components/Base/Form";

import { useLoginUserMutation } from "@/stores/apiSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authenticateUser } from "@/stores/authReducer";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingIcon from "@/components/Base/LoadingIcon";
import logo from  '../../assets/images/company/logo.png';
import NavigationBarSecondary from "@/components/NavigationBarSecondary";
function Main() {
  // const [loginUser, { isLoading: logging_in, isSuccess: success, error }] = useLoginUserMutation();
  const {i18n,t}  = useTranslation()
  const schema = yup
    .object({
      email: yup.string().required(t('The email field is required')),
      password: yup.string().required(t("The password is required")),
    })
    .required();

  const {
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const basicStickyNotification = useRef();
  const [toastMessage, setToastMessage] = useState("")
  const [loginUser, { isLoading: logging_in, isSuccess: success, error }] = useLoginUserMutation();
  const onSubmit = async (data) => {
    try{
      const response = await loginUser(data).unwrap()
      dispatch(authenticateUser(response.data))
      if(response.data?.permissions.includes("view-my-company")){
        navigate('/menu/dashboard');
      }
      else{
        navigate('/menu/dashboard');
      }
    }
    catch(error){
      let error_Messages = error?.data?.data?.error || error?.message;
      setToastMessage(error_Messages ?? "Something went wrong");
      basicStickyNotification.current?.showToast();
    }
  };
  return (
    <>
      <NavigationBarSecondary />

      <Notification getRef={(el)=> {
        basicStickyNotification.current = el;
        }}
        className="flex flex-col sm:flex-row"
        >
        <div className="font-medium">
            {toastMessage}
        </div>
    </Notification>
   
      <div className="container grid lg:h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] py-10 px-5 sm:py-14 sm:px-10 md:px-36 lg:py-0 lg:pl-14 lg:pr-12 xl:px-24">
        <div
          className={clsx([
            "relative z-50 h-full col-span-12 p-7 sm:p-14 bg-white rounded-2xl lg:bg-transparent lg:pr-10 lg:col-span-5 xl:pr-24 2xl:col-span-4 lg:p-0 dark:bg-darkmode-600",
            "before:content-[''] before:absolute before:inset-0 before:-mb-3.5 before:bg-white/40 before:rounded-2xl before:mx-5 dark:before:hidden",
          ])}
        >
          <div className="relative z-10 flex flex-col justify-center w-full h-full py-2 lg:py-32">
            <div className="rounded-[0.8rem] w-[100px] h-[100px]  border-primary/30 flex items-center justify-center">
              <img src={logo} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
              <div className="text-2xl font-medium">{t('Sign In')}
                
              </div>
              {/* <Link to='/register' className="mt-2.5 text-slate-600 dark:text-slate-400">
                {t("Don't have an account?")}{" "}
                <Link to='/register' className="font-medium text-primary">
                  {t("Sign Up")}
                </Link>
              </Link> */}
              {/* <Alert
                variant="outline-primary"
                className="flex items-center px-4 py-3 my-7 bg-primary/5 border-primary/20 rounded-[0.6rem] leading-[1.7]"
              >
                {({ dismiss }) => (
                  <>
                    <div className="">
                      <Lucide
                        icon="Lightbulb"
                        className="stroke-[0.8] w-7 h-7 mr-2 fill-primary/10"
                      />
                    </div>
                    <div className="ml-1 mr-8">
                      Welcome to <span className="font-medium">Tailwise</span>{" "}
                      demo! Simply click{" "}
                      <span className="font-medium">Sign In</span> to explore
                      and access our documentation.
                    </div>
                    <Alert.DismissButton
                      type="button"
                      className="btn-close text-primary"
                      onClick={dismiss}
                      aria-label="Close"
                    >
                      <Lucide icon="X" className="w-5 h-5" />
                    </Alert.DismissButton>
                  </>
                )}
              </Alert> */}
              <div className="mt-6">
                <div className="input-form">
                                <FormLabel
                                  htmlFor="validation-form-1"
                                  className="flex flex-col w-full sm:flex-row"
                                >
                                  {t('Email')} / {t('Phone')}
                                </FormLabel>
                                <FormInput
                                  {...register("email")}
                                  id="validation-form-1"
                                  type="text"
                                  name="email"
                                  className={clsx({
                                    "border-danger": errors.email,
                                  })}
                                  placeholder={t("enter your email or phone")}
                                />
                                {errors.email && (
                                  <div className="mt-2 text-danger">
                                    {typeof errors.email.message === "string" &&
                                      errors.email.message}
                                  </div>
                                )}
                              </div>
                              <div className="mt-3 input-form">
                                <FormLabel
                                  htmlFor="validation-form-1"
                                  className="flex flex-col w-full sm:flex-row"
                                >
                                  {t("Password")}
                                  {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Required, at least 2 characters
                                  </span> */}
                                </FormLabel>
                                <FormInput
                                  {...register("password")}
                                  id="validation-form-1"
                                  type="password"
                                  name="password"
                                  className={clsx({
                                    "border-danger": errors.password,
                                  })}
                                  placeholder={t("Your Password")}
                                />
                                {errors.password && (
                                  <div className="mt-2 text-danger">
                                    {typeof errors.password.message === "string" &&
                                      errors.password.message}
                                  </div>
                                )}
                              </div>
                <div className="flex mt-4 text-xs text-slate-500 sm:text-sm">
                  <div className="flex items-center mr-auto">
                    <FormCheck.Input
                      id="remember-me"
                      type="checkbox"
                      className="mr-2.5 border"
                    />
                    <label
                      className="cursor-pointer select-none"
                      htmlFor="remember-me"
                    >
                      {t("Remember me")}
                    </label>
                  </div>
                  <Link to="/forgot-password">{t("Forgot Password?")}</Link>
                </div>
                <div className="mt-5 text-center xl:mt-8 xl:text-left">
                  <Button
                    variant="primary"
                    rounded
                    type="submit"
                    disabled={logging_in}
                    className="bg-gradient-to-r from-theme-1/70 to-theme-2/70 w-full py-3.5 xl:mr-3 dark:border-darkmode-400"
                  >
                    {t("Sign In")} 
                    {logging_in && <LoadingIcon icon="oval" className="mx-2 w-5 h-5 text-white" color="#ffffff" />}
                    
                  </Button>
                  {/* <Link to="/register">
                    <Button
                      variant="outline-secondary"
                      rounded
                      type="button"
                      className="bg-white/70 w-full py-3.5 mt-3 dark:bg-darkmode-400"
                    >
                      {t("Sign Up")}
                    </Button>
                  </Link> */}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="fixed container grid w-screen inset-0 h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] pl-14 pr-12 xl:px-24">
        <div
          className={clsx([
            "relative h-screen col-span-12 lg:col-span-5 2xl:col-span-4 z-20",
            "after:bg-white after:hidden after:lg:block after:content-[''] after:absolute after:right-0 after:inset-y-0 after:bg-gradient-to-b after:from-white after:to-slate-100/80 after:w-[800%] after:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0] dark:after:bg-darkmode-600 dark:after:from-darkmode-600 dark:after:to-darkmode-600",
            "before:content-[''] before:hidden before:lg:block before:absolute before:right-0 before:inset-y-0 before:my-6 before:bg-gradient-to-b before:from-white/10 before:to-slate-50/10 before:bg-white/50 before:w-[800%] before:-mr-4 before:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0] dark:before:from-darkmode-300 dark:before:to-darkmode-300",
          ])}
        ></div>
        <div
          className={clsx([
            "h-full col-span-7 2xl:col-span-8 lg:relative",
            "before:content-[''] before:absolute before:lg:-ml-10 before:left-0 before:inset-y-0 before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:w-screen before:lg:w-[800%]",
            "after:content-[''] after:absolute after:inset-y-0 after:left-0 after:w-screen after:lg:w-[800%] after:bg-texture-white after:bg-fixed after:bg-center after:lg:bg-[25rem_-25rem] after:bg-no-repeat",
          ])}
        >
          <div className="sticky top-0 z-10 flex-col justify-center hidden h-screen ml-16 lg:flex xl:ml-28 2xl:ml-36 flex justify-center items-center">
            <img src={logo} className="w-64 h-auto"/>
            {/* <div className="leading-[1.4] text-[2.6rem] xl:text-5xl font-medium xl:leading-[1.2] text-white">
             National Info Business Directory
            </div> */}
            {/* <div className="mt-5 text-base leading-relaxed xl:text-lg text-white/70">
            Experience the power of our platform, where seamless import processes meet organized, real-time inventory tracking. Empower your business with tools designed to simplify operations and enhance productivity.
            </div> */}
            <div className="flex flex-col gap-3 mt-10 xl:items-center xl:flex-row">
              {/* <div className="flex items-center">
                <div className="w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="NIBDET"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="NIBDET"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="NIBDET"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="NIBDET"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
              </div> */}
              {/* <div className="text-base xl:ml-2 2xl:ml-3 text-white/70">
              Join 10k+ businesses that trust us for smarter inventory control. Your journey starts here. 🚀
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <ThemeSwitcher />
    </>
  );
}

export default Main;
