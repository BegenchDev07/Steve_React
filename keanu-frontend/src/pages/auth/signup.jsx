import React, {useState, useEffect} from "react";
import {checkUserName, createUser} from "/src/services/API/user";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAppSelector, useAppDispatch} from "/src/redux/hooks";
import {apiCatcher} from "/src/utils/apiChecker";
import {USER_LOGIN_SUCCESS} from "/src/redux/constants/userConstants";
import {createAlert} from "/src/redux/reducers/AlertSlice";


import {load, save} from "/src/utils/storageOperation.js";


const SIGNUP = 'signup'
const loadValue = key => load(SIGNUP, key);
const saveValue = (key, value) => save(SIGNUP, key, value);
const getDefaultUsrNm = searchParams=>searchParams.get("username")?.replace(/[^a-zA-Z0-9_.-]*/gm,'');
export default function SignUp() {
    const [searchParams] = useSearchParams()
    const [username, setUsername] = useState(getDefaultUsrNm(searchParams));
    const [email, setEmail] = useState(searchParams.get("email")??"");
    const [password, setPassword] = useState("");
    const [isPasswordsValid, setIsPasswordsValid] = useState(false);
    const [invitationCode, setInvitationCode] = useState("xxx");
    const [isInput, setIsInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [error,setError] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const platform = searchParams.get("platform")??'email';
    const openid = searchParams.get("openid")??"";



    useEffect(_=>{
       const signup =  loadValue(platform);
       if(!signup)
           saveValue(platform, {openid,username});


    },[]);

    const handleUsernameChange = event => {
        setIsInput(true);
        if((/^[a-zA-Z0-9_.]*$/.test(event.target.value))){
            setError(false)
            setUsername(event.target.value);
            setIsLoading(true);
    
            checkUserName(event.target.value)
                .then(_=> {
                    setIsLoading(false);
                    setIsUsernameAvailable(!res.exist);
                })
    
            if (!username) {
                setIsInput(false);
            }
        } else {
            setError(true)
        }        
        
    };

    const handleEmailChange = event => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = event => {
        setPassword(event.target.value);
    };

    const handlePasswordRepeatChange = event => {
        if (password === event.target.value) {
            setIsPasswordsValid(true);
        } else {
            setIsPasswordsValid(false);
        }
    };

    const handleInvitationCodeChange = event => {
        setInvitationCode(event.target.value);
    };
    const handleSubmit = (evt) => {
        evt.preventDefault();        
        apiCatcher(dispatch, createUser, username, email, password, platform, openid, invitationCode)
            .then(({profile, loginToken,username}) => {
                localStorage.setItem("user", JSON.stringify({profile, loginToken,username}));
                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: {user: {profile, loginToken,username}},
                });
                navigate("/");
            })
        
    };

    return (
        <div className="w-full h-full overflow-none flex items-center justify-center text-3xl	font-bold">
            <div className="w-3/5 h-full">
                <div className="py-10">
                    <div className="md:grid md:grid-cols-5 md:gap-6">
                        <div className="md:col-span-2">                            
                            <div className="px-4 sm:px-0 pb-4">
                                <h3 className="text-lg font-medium leading-6">Sign up</h3>
                                <p className="text-sm text-slate-600">
                                    Complete user registration
                                </p>
                            </div>                            
                        </div>
                        <div className="flex flex-col mt-5 md:mt-0 md:col-span-3 h-full gap-5">
                            <form action="#" method="POST">
                                <div className="shadow sm:rounded-md sm:overflow-hidden">
                                    <div className="px-4 bg-white sm:py-4">
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="col-span-3 sm:col-span-2 flex flex-col gap-2">                                            
                                                <label
                                                    className="block text-sm font-medium text-gray-700 after:content-['*']  after:text-red-600 after:px-2">
                                                    Username
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <input
                                                        defaultValue={username}
                                                        onChange={handleUsernameChange}
                                                        className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                                                        type="text"
                                                        aria-label="Filter projects"
                                                        required
                                                        placeholder="Username"
                                                    />
                                                </div>
                                                {
                                                    (error)
                                                    &&
                                                    <p className="text-red-600 text-sm">Username can only contains 0-9 a-z  "." and "_"</p>
                                                }
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-6 pt-5">
                                            <div className="col-span-3 sm:col-span-2 flex flex-col gap-2">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 after:content-['*']  after:text-red-600 after:px-2">
                                                    Email
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <input

                                                        defaultValue={email}
                                                        onChange={handleEmailChange}
                                                        className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                                                        type="email"
                                                        aria-label="Filter projects"
                                                        required
                                                        placeholder="Email"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-6 pt-5">
                                            <div className="col-span-3 sm:col-span-2 flex flex-col gap-2">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 after:content-['*']  after:text-red-600 after:px-2">
                                                    Password
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <input
                                                        onChange={handlePasswordChange}
                                                        className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                                                        type="password"
                                                        aria-label="Filter projects"
                                                        required
                                                        placeholder="Password"
                                                    />
                                                </div>
                                            </div>
                                        </div>                                        
                                        <div className="w-full h-56 px-2 py-2 overflow-y-scroll text-red-600 mt-5">
                                            <div className="px-4 sm:px-0 text-md">
                                                <h3 className="text-xl font-bold leading-6 py-2">Attention !</h3>                                
                                                <p className="text-sm font-medium">We will not use your email address without your explicit consent!</p>
                                                <h3 className="text-xl font-bold leading-6 py-4 ">Purpose of Email Collection:</h3>                                
                                                <p className="text-sm font-medium">Your email address will be used solely for the following purposes:</p>                                
                                                <ul className="list-disc text-sm font-semibold px-4">
                                                    <li>Reset password</li>
                                                    <li>Project invitation letter</li>
                                                </ul>
                                                <h3 className="text-xl font-bold leading-6 py-4">Privacy Assurance:</h3>                                
                                                <p className="text-sm font-medium">We are committed to ensuring that your privacy is protected. We want to assure you that:</p>                                
                                                <ul className="list-disc text-sm font-semibold px-4">
                                                    <li>We will not sell, rent, or lease your email address to third parties.</li>
                                                    <li>We will not collect, store, or process any other private information beyond your email address.</li>
                                                    <li>We will implement appropriate security measures to protect your email address from unauthorized access.</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6 pt-5">
                                            <div className="col-span-3 sm:col-span-2 flex flex-col gap-2">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 after:content-['*']  after:text-red-600 after:px-2">
                                                    Email settings
                                                </label>
                                                <div className="w-full mt-1 flex flex-col rounded-md font-medium text-sm">
                                                    <div className="w-full flex items-center gap-3">
                                                        <label>Public</label>                                                    
                                                        <input    
                                                            className="h-4 w-4 outline-none"                                                    
                                                            type="checkbox"                                                        
                                                            required                                                        
                                                        />
                                                    </div>
                                                    <div className="w-full flex items-center gap-3">
                                                        <label>Subscribe updates</label>                                                    
                                                        <input                                                        
                                                            className="h-4 w-4 outline-none"                                                    
                                                            type="checkbox"                                                        
                                                            required                                                        
                                                        />
                                                    </div>
                                                    <div className="w-full flex items-center gap-3">
                                                        <label>Receive invitations</label>                                                    
                                                        <input                                                        
                                                            className="h-4 w-4 outline-none"                                                    
                                                            type="checkbox"                                                        
                                                            required                                                        
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>

                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                        <button
                                            type="submit"
                                            onClick={handleSubmit}
                                            className="inline-flex text-white justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-red bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Sign up
                                        </button>
                                    </div>
                                </div>
                            </form>                            
                        </div>                                                        
                    </div>
                </div>
            </div>
        </div>
    );
}

