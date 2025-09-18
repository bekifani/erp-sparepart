import { FormCheck, FormInput, FormLabel } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import _ from "lodash";
import ThemeSwitcher from "@/components/ThemeSwitcher/index.tsx";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useSignUpUserMutation } from "@/stores/apiSlice";
import { Link } from "react-router-dom";
import logo from  '../../assets/images/company/logo.png';


function Main() {
  const schema = yup
    .object({
    name: yup.string().required("Name is Required"),
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .max(20, "Password shouldn't be more than 20 characters")
      .required("Please enter password"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match"),
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

  const [ registerUser, {data: registered_data, isLoading:loading}] = useSignUpUserMutation()
  const onSubmit = async (data: any) => {
    console.log(data, ' is signup data');
    try {
      const response = await registerUser(data).unwrap(); // unwraps the result
      console.log('User registered successfully:', response);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  }

  return (
    <>
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
            <div className="">
              <div className="text-2xl font-medium">Sign Up</div>
              <div className="mt-2.5 text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary">
                  Sign In
                </Link>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}  className="mt-6">
                <div className="mt-3 input-form">
                    <FormLabel
                      htmlFor="validation-form-1"
                      className="flex flex-col w-full sm:flex-row"
                    >
                      Name *
                      {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                        Required, at least 2 characters
                      </span> */}
                    </FormLabel>
                    <FormInput
                      {...register("name")}
                      id="validation-form-1"
                      type="text"
                      name="name"
                      className={clsx({
                        "border-danger": errors.name,
                      })}
                      placeholder="Your Name"
                    />
                    {errors.name && (
                      <div className="mt-2 text-danger">
                        {typeof errors.name.message === "string" &&
                          errors.name.message}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 input-form">
                    <FormLabel
                      htmlFor="validation-form-1"
                      className="flex flex-col w-full sm:flex-row"
                    >
                      Email *
                      {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                        Required, at least 2 characters
                      </span> */}
                    </FormLabel>
                    <FormInput
                      {...register("email")}
                      id="validation-form-1"
                      type="email"
                      name="email"
                      className={clsx({
                        "border-danger": errors.email,
                      })}
                      placeholder="Your Email"
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
                        Password
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
                        placeholder="Password"
                      />
                      {errors.password && (
                        <div className="mt-2 text-danger">
                          {typeof errors.password.message === "string" &&
                            errors.password.message}
                        </div>
                      )}
                    </div>
                    <div className="grid w-full h-1.5 grid-cols-12 gap-4 mt-3.5">
                  <div className="h-full col-span-3 border rounded active bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                  <div className="h-full col-span-3 border rounded active bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                  <div className="h-full col-span-3 border rounded active bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                  <div className="h-full col-span-3 border rounded bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                </div>

                              <div className="mt-3 input-form">
                                <FormLabel
                                  htmlFor="validation-form-1"
                                  className="flex flex-col w-full sm:flex-row"
                                >
                                  Confirm Password
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
                                  placeholder="Confirm Your Password"
                                />
                                {errors.password_confirmation && (
                                  <div className="mt-2 text-danger">
                                    {typeof errors.password_confirmation.message === "string" &&
                                      errors.password_confirmation.message}
                                  </div>
                                )}
                              </div>
                
              
                <a
                  href=""
                  className="block mt-3 text-xs text-slate-500/80 sm:text-sm dark:text-slate-400"
                >
                  What is a secure password?
                </a>
                
                <div className="flex items-center mt-5 text-xs text-slate-500 sm:text-sm">
                  <FormCheck.Input
                    id="remember-me"
                    type="checkbox"
                    className="mr-2 border"
                  />
                  <label
                    className="cursor-pointer select-none"
                    htmlFor="remember-me"
                  >
                    I agree to the
                  </label>
                  <a className="ml-1 text-primary dark:text-slate-200" href="#">
                    Terms & Conditions
                  </a>
                  .
                </div>
                <div className="mt-5 text-center xl:mt-8 xl:text-left">
                <Button
                    variant="outline-secondary"
                    rounded
                    className="bg-white/70 w-full py-3.5 mt-3 dark:bg-darkmode-400 mb-2"
                    type="submit"
                  >
                    Sign Up
                  </Button>
                  <Link to='/login'>
                    <Button
                      variant="primary"
                      rounded
                      type="button"
                      className="bg-gradient-to-r from-theme-1/70 to-theme-2/70 w-full py-3.5 xl:mr-3 dark:border-darkmode-400"
                    >
                      Sign In
                    </Button>
                  </Link>
                  
                </div>
              </form>
            </div>
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
          <div className="sticky top-0 z-10 flex-col justify-center hidden h-screen ml-16 lg:flex xl:ml-28 2xl:ml-36">
            <div className="leading-[1.4] text-[2.6rem] xl:text-5xl font-medium xl:leading-[1.2] text-white">
              Embrace Excellence <br /> in Inventory Management
            </div>
            <div className="mt-5 text-base leading-relaxed xl:text-lg text-white/70">
              Unlock the potential of Tailwise, where developers craft
              meticulously structured, visually stunning dashboards with
              feature-rich modules. Join us today to shape the future of your
              application development.
            </div>
            <div className="flex flex-col gap-3 mt-10 xl:items-center xl:flex-row">
              <div className="flex items-center">
                <div className="w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="ERP"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="ERP"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="ERP"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="ERP"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
              </div>
              <div className="text-base xl:ml-2 2xl:ml-3 text-white/70">
                Over 7k+ strong and growing! Your journey begins here.
              </div>
            </div>
          </div>
        </div>
      </div>
      <ThemeSwitcher />
    </>
  );
}

export default Main;
