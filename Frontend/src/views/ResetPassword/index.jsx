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

import { useGetPasswordResetPinMutation, useResetPasswordMutation } from "@/stores/apiSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { useTranslation } from "react-i18next";
import logo from '../../assets/images/company/logo_new.png';
import logoMini from  '../../assets/images/company/logomini.png';
import { useRef, useState } from "react";

function Main() {
  const { t, i18n} = useTranslation()
  const [resetPassword, { isLoading: saving_password, isSuccess: success, error }] = useResetPasswordMutation();
  const [resendPin, { isLoading: sending_link, isSuccess: sent, errorSending }] = useGetPasswordResetPinMutation();
  const schema = yup
    .object({
      pin: yup.number().required(),
      password: yup.string().required(),
      password_confirmation: yup.string().required(),
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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const onSubmit = async (data) => {
    data.email =  searchParams.get("email");
    data.phone =  searchParams.get("phone");
    try{
      const response = await resetPassword(data)
      setToastMessage(response?.data?.message ?? t("Password Changed Successfully"));
      basicStickyNotification.current?.showToast();
      if(response?.data?.success){
        navigate('/login');
      }
    }
    catch(error){
      let error_Messages = error?.data?.data?.error || error?.message;
      setToastMessage(error_Messages ?? t("Something went wrong"));
      basicStickyNotification.current?.showToast();
    }
    
    if(response?.data?.success){
      navigate('/login');
    }
  };
  const basicStickyNotification = useRef();
  const [toastMessage, setToastMessage] = useState("")

  const resendNewPin = async () => {
    // data.email =  searchParams.get("name");
    let payload = {
      "email" : searchParams.get("email"),
      "phone" : searchParams.get("phone"),
    }
    
    try{
      const response = await resendPin(payload)
      setToastMessage(response.data.message);
      basicStickyNotification.current?.showToast();
    }
    catch(error){
      let error_Messages = error?.data?.data?.error || error?.message;
      setToastMessage(error_Messages ?? t("Something went wrong"));
      basicStickyNotification.current?.showToast();
    }
  };
  return (
    <>
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
            <div className="rounded-[0.8rem] w-[55px] h-[55px] border border-primary/30 flex items-center justify-center">
              <div className="relative flex items-center justify-center w-[50px] rounded-[0.6rem] h-[50px] bg-gradient-to-b from-theme-1/90 to-theme-2/90 bg-white">
              <img src={logoMini} />
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
              <div className="text-2xl font-medium">{t("Reset Your Password")}</div>
              
              <div className="mt-6">
                <div className="input-form">
                                <FormLabel
                                  htmlFor="validation-form-1"
                                  className="flex flex-col w-full sm:flex-row"
                                >
                                  {t('Reset Pin')}
                                  {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Required, at least 2 characters
                                  </span> */}
                                </FormLabel>
                                <FormInput
                                  {...register("pin")}
                                  id="validation-form-1"
                                  type="number"
                                  name="pin"
                                  className={clsx({
                                    "border-danger": errors.pin,
                                  })}
                                  placeholder={t('Write the code here')}
                                />
                                {errors.pin && (
                                  <div className="mt-2 text-danger">
                                    {typeof errors.pin.message === "string" &&
                                      errors.pin.message}
                                  </div>
                                )}
                              </div>
                              <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        {t("New Password")}
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
                        placeholder={t("Password")}
                      />
                      {errors.password && (
                        <div className="mt-2 text-danger">
                          {typeof errors.password.message === "string" &&
                            errors.password.message}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 input-form">
                                <FormLabel
                                  htmlFor="validation-form-1"
                                  className="flex flex-col w-full sm:flex-row"
                                >
                                  {t("Confirm Password")}
                                  {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Required, at least 2 characters
                                  </span> */}
                                </FormLabel>
                                <FormInput
                                  {...register("password_confirmation")}
                                  id="validation-form-1"
                                  type="password"
                                  name="password_confirmation"
                                  className={clsx({
                                    "border-danger": errors.password_confirmation,
                                  })}
                                  placeholder={t("Confirm Your Password")}
                                />
                                {errors.password_confirmation && (
                                  <div className="mt-2 text-danger">
                                    {typeof errors.password_confirmation.message === "string" &&
                                      errors.password_confirmation.message}
                                  </div>
                                )}
                              </div>
                              <Link to='/login' className="mt-2.5 text-slate-600 dark:text-slate-400">
                <p className="font-medium text-primary mt-4">
                  {t("Back To Login")}
                </p>
              </Link>
               
                <div className="mt-3 text-center xl:mt-8 xl:text-left">
                  <Button
                    variant="primary"
                    rounded
                    type="submit"
                    disabled={saving_password}
                    className="bg-gradient-to-r from-theme-1/70 to-theme-2/70 w-full py-3.5 xl:mr-3 dark:border-darkmode-400"
                  >
                    {t("Save New Password")}
                    {saving_password && <LoadingIcon icon="oval" className="mx-2 w-5 h-5 text-white" color="#ffffff" />}
                  </Button>
                  
                  <Button
                    variant="outline-secondary"
                    rounded
                    type="button"
                    disabled={sending_link}
                    onClick={()=>resendNewPin()}
                    className="bg-white/70 w-full py-3.5 mt-3 dark:bg-darkmode-400"
                  >
                    {t('Resend New PIN')}
                    {sending_link && <LoadingIcon icon="oval" className="mx-2 w-5 h-5 text-white" color="#ffffff" />}

                  </Button>
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
