import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { updatePassword } from "../utils/resetPassword";
import { apiCatcher } from "../utils/apiChecker";
import { useAppDispatch } from "../redux/hooks.js";


const ResetPassword = () => {

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState(false);
    const [errStat, setErrStat] = useState(false);

    const {token} = useParams();    
    const navigator = useNavigate()
    const dispatch = useAppDispatch()


    const handlePasswordChange = event => {
        setPassword(event.target.value);
    };

    const handleEmailInsert = event => {
        setEmail(event.target.value)
    };

    const handleResetPassword = () => {        
        apiCatcher(dispatch,updatePassword,email,token,password)
        .then((result)=>{
            if(result)
                setErrStat(false);
                navigator('/login')
        })
        .catch((err)=>{
            setErrStat(true)
        })                    
    }    
    return (        
        <>
        <div className="w-full h-full overflow-none flex items-center justify-center text-3xl font-bold">
            <div className="w-2/5 h-full">
                <div className="w-full h-full bg-gray-500">

                </div>
            </div>
            <div className="w-3/5 mx-10">
                <div className="">
                    {/* <form method="POST" onSubmit={handleResetPassword}> */}
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium leading-6">Reset Password</h3>
                                <p className="mt-1 text-sm text-slate-600 py-2">
                                    Please enter your email and new password !
                                </p>
                            </div>
                        </div>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-3 sm:col-span-2 flex flex-col gap-2">
                                    <label
                                        className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-600 after:px-2">
                                        Email
                                    </label>
                                    <div className="mt-1 flex rounded-md">                                        
                                        <input
                                            onChange={handleEmailInsert}
                                            className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm "
                                            type="email"                                            
                                            placeholder="Email"
                                            required
                                        />
                                    </div>
                                    {
                                        (errStat)
                                        &&
                                        <div className="mt-1 flex">
                                            <p className="text-sm font-medium text-red-600">Wrong or missing email !</p>
                                        </div>
                                    }
                                </div>
                            </div> 
                            <div className="grid grid-cols-3 gap-6">
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
                            </div>

                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    type="submit"
                                    onClick={handleResetPassword}
                                    className="inline-flex text-white justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-red bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    {/* </form> */}
                </div>                
            </div>            
        </div>
        </>
    )
}

export default ResetPassword;