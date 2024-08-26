import {useState, useRef, useEffect} from "react";
import {useNavigate, Navigate, Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useAppSelector, useAppDispatch} from "/src/redux/hooks";
import {emailLogin, googleLogin} from "/src/redux/actions/auth";
import {getBackendURL, getRedirectURL} from "../../utils/reader";
import GoogleSVG from '../../assets/icons/3rdParties/google.svg'
import keanuFetch from "../../utils/keanuFetch";

export default function BentoEmailLogin({}) {
    const navigate = useNavigate();
    const form = useRef(null);
    const {isLoggedIn} = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [idToken,  setIDToken] = useState(null);
    const [errStat, setErrStat] = useState(false);    
    const dispatch = useAppDispatch();
    const baseURL = getBackendURL();
    const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth?";
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const onSubmit = handleSubmit((data) => {
        setLoading(true);

        //solution to check wether its a mail or string
        //https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript        

        if(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.login)){                        
            return dispatch(emailLogin(data.login, data.password,null))
                .then(_ => navigate("/"))                        
                .catch((err)=>{setErrStat(true)})
                .finally(_ => setLoading(false));
        } else {                  
            return dispatch(emailLogin(null, data.password, data.login))
                .then(_ => navigate("/"))                        
                .catch((err)=>{setErrStat(true)})
                .finally(_ => setLoading(false));
        }

    });

    const fetchProfile = (id_token)=>{
        const url = new URL("https://oauth2.googleapis.com/tokeninfo");
        url.searchParams.append('id_token', id_token);
        return keanuFetch().get(url);
    }
    

    const GLogin = () => {
        const redirect_uri = `${getRedirectURL(3001)}/login`;
        const client_id = "531508863454-5ppgup81g9galc9vga66su33ondgfvfj.apps.googleusercontent.com"
        const scope = "openid email https://www.googleapis.com/auth/userinfo.profile"
        const response_type = "id_token token"
    
        const link = new URL(GOOGLE_AUTH);
        link.searchParams.append("scope", scope);
        link.searchParams.append("response_type", response_type);
        link.searchParams.append("redirect_uri", redirect_uri);
        link.searchParams.append("client_id", client_id);
        link.searchParams.append("nonce", 'onlyfortest');
    
        return link.toString();
    
    }

    useEffect(() => {        
        if (isLoggedIn) {
            // https://reactrouter.com/en/main/hooks/use-navigate
            // navigate(-1) is equivalent to hitting the back button
            return navigate('/'); //navigate(-1);
        }
    }, [isLoggedIn]);
    
    useEffect(_=>{
        if(/google/.test(window.location.href)){            
            const id_token = new URLSearchParams(window.location.toString()).get('id_token');            
            fetchProfile(id_token)
                .then(({name, email, picture, sub})=>{
                        return dispatch(googleLogin(sub)).then(({loginToken,openid })=>{
                            console.log(openid, email,name,picture);
                            debugger;
                            if(loginToken)
                                return navigate('/'); //navigate(-1);
                            else{
    
                                return navigate(`/signup?platform=google&openid=${openid}&email=${email}&username=${name}&avatar=${picture}`);
                            }
                        });
                })
        }
        

    },[])

    return (
        <>
            {isLoggedIn ? (
                <Navigate replace to="/home"/>
            ) : (
                <>
                <div className="w-1/2 h-full flex flex-col items-center justify-center">
                    <div className="w-full flex items-center justify-center container px-16">
                        <div className="w-full flex flex-col justify-start gap-10">
                            <div className="w-full flex flex-col gap-5 py-8">
                                <div className="text-start font-bold text-4xl px-5">
                                Login to GameHub
                                </div>
                                <div className="text-start text-gray-400 font-bold text-xl px-5">
                                    Good to have you back !
                                </div>
                            </div>                            
                            <div className="w-full flex items-center justify-center">                                                                                        
                                    <form onSubmit={onSubmit} ref={form} className="w-full px-5 flex flex-col gap-5">
                                        <div className="w-2/3 flex flex-col">
                                            <a
                                                href={GLogin()}
                                                // onClick={()=>{GLogin()}}
                                                className="h-12 w-full flex items-center justify-center gap-3 cursor-pointer rounded-md bg-blue-500 text-white text-xl font-semibold">
                                                <img src={GoogleSVG} className="h-8" alt="" />
                                                Sign in with Google
                                            </a>                                        
                                        </div>
                                        <div className="w-full flex items-start">
                                            <h1 className="text-xl font-bold">OR</h1>
                                        </div>                                        
                                        <input type="submit" hidden />
                                        <div className="w-full flex gap-5">
                                            <div className="w-full">                                            
                                                <input
                                                    name="email"
                                                    placeholder="Email or Username"
                                                    type="text"
                                                    {...register("login", {required: true})}
                                                    className="px-1 w-full h-10 border-2 rounded-md font-semibold"
                                                    required
                                                />
                                            </div>
                                            <div className="w-full">                                            
                                                <input
                                                    name="password"
                                                    placeholder="Password"
                                                    type="password"
                                                    {...register("password", {required: true})}
                                                    className="px-1 w-full h-10 border-2 rounded-md font-semibold"
                                                    required
                                                />
                                            </div>
                                            <div className="w-24 flex items-center">
                                            {loading && (
                                                    <svg
                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400"
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
                                            </div>
                                        </div>
                                        <div className="w-full flex items-start">
                                            {
                                                (errStat)
                                                &&
                                                <p className="text-red-600">Email or Password are wrong or account doesn't exist !</p>
                                            }
                                        </div>
                                        <input type="Submit" className="cursor-pointer bg-blue-600 rounded-lg font-bold text-xl text-white w-1/4 py-1 px-2" value="Login"/>
                                        <div className="w-2/3 flex justify-between">
                                            <Link
                                            className="w-full text-start text-indigo-500 underline"
                                            to='/forgotpass'
                                            >
                                            Forgot Password ?
                                            </Link>
                                            OR
                                            <div className="w-full text-gray-400 px-5">
                                                <Link
                                                className="w-full text-start text-indigo-500 bg-blue-500 px-2 py-2 text-white no-underline rounded-md"
                                                to='/signup'>
                                                Sign up
                                                </Link>                                                
                                            </div>
                                        </div>                                        
                                    </form>
                                {/* </div> */}

                            </div>                            
                        </div>
                    </div>                    
                </div>
                <div className="w-1/2">
                        <div className="w-full h-full bg-gray-500">

                        </div>
                </div>
                </>
            )}
        </>
    );
}