import React, {useState, useRef, useEffect} from "react";
import {useNavigate, Navigate, Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useAppSelector, useAppDispatch} from "/src/redux/hooks";
import {emailLogin} from "/src/redux/actions/auth";
import { apiCatcher } from "../../utils/apiChecker";


export default function EmailLogin() {
    const navigate = useNavigate();
    const form = useRef(null);
    const {isLoggedIn} = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const onSubmit = handleSubmit((data) => {
        setLoading(true);
        // apiCatcher(dispatch, emailLogin, data.email, data.password)
        // .then((result)=>{
        //     debugger;
        // })
        return dispatch(emailLogin(data.email, data.password))
            .then(_ => navigate("/"))            
            .finally(_ => setLoading(false));
    });

    useEffect(() => {
        if (isLoggedIn) {
            // https://reactrouter.com/en/main/hooks/use-navigate
            // navigate(-1) is equivalent to hitting the back button
            return navigate('/'); //navigate(-1);
        }
    }, [isLoggedIn]);

    return (
        <>
            {isLoggedIn ? (
                <Navigate replace to="/home"/>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col justify-center">
                            <div className="text-center font-semibold text-4xl leading-loose">
                               GameHub Login
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="w-80">
                                    {/* {error && <Alert description={error} type="error" closable />} */}
                                    <form onSubmit={onSubmit} ref={form} className="block">
                                        <div className="w-full">
                                            <div className="w-full text-left">
                                                Email
                                            </div>
                                            <input
                                                type="email"
                                                {...register("email", {required: true})}
                                                className="px-1 w-full h-10 border-2 rounded-md border-indigo-600"
                                            />
                                        </div>
                                        <div className="w-full mt-6">
                                            <div className="w-full text-left">
                                                Password
                                            </div>
                                            <input
                                                type="password"
                                                {...register("password", {required: true})}
                                                className="px-1 w-full h-10 border-2 rounded-md border-indigo-600"
                                            />
                                        </div>
                                        <div>
                                            <button
                                                className="h-10 w-full flex items-center justify-center mt-6 rounded-md bg-indigo-500 text-white text-xl">
                                                {loading && (
                                                    <svg
                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                )}
                                                Log In
                                            </button>
                                            <button
                                            className="h-10 w-full flex items-center justify-center mt-6 rounded-md bg-green-600 text-white text-xl"
                                            onClick={()=>{navigate('/signup')}}
                                            >
                                            
                                            Sign Up
                                            </button>
                                            <div className="w-full flex py-4 underline">
                                                <Link
                                                className="w-full text-center"
                                                to='#'
                                                >
                                                Forgot Password ?
                                                </Link>
                                            </div>
                                        </div>

                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}