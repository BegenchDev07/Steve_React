import { useNavigate } from "react-router-dom";
import { sendEmail } from "../utils/resetPassword";
import { apiCatcher } from "../utils/apiChecker";
import { useAppDispatch } from "../redux/hooks.js";
import { useState } from "react";

const ForgotPassword = () => {
    
    // const navigator = useNavigate()
    const dispatch = useAppDispatch()
    const [emailAddr,setEmailAddr] = useState();
    const [emailStat, setEmailStat] = useState(false);
    const [errStat, setErrStat] = useState(false);

    const handleEmailAddr = (e) => {
        setEmailAddr(e.target.value)
    }
    const handleEmail = _ => {        
        apiCatcher(dispatch, sendEmail, emailAddr)
        .then((result)=>{
            if(result.$metadata.httpStatusCode)
                setErrStat(false);
                setEmailStat(true);
        })
        .catch((err)=>{
            setErrStat(true);
        })   
    };
 
    return (
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
                                <h3 className="text-lg font-medium leading-6">Enter Email</h3>
                                <p className="mt-1 text-sm text-slate-600 py-2">
                                    Please enter your email to reset your password !
                                </p>
                            </div>
                        </div>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                <div className="grid grid-cols-3 gap-6">
                                    {
                                        (!emailStat)
                                        ?
                                        <div className="col-span-3 sm:col-span-3 flex flex-col gap-2">
                                            <label
                                                className="block text-sm font-medium text-gray-700 ">
                                                Email
                                            </label>
                                            <input
                                                    onChange={handleEmailAddr}
                                                    className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-2/3 text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                                                    type="email"
                                                    // aria-label="Filter projects"
                                                    placeholder="Email"
                                                    required
                                                />
                                            {
                                                (errStat)
                                                &&
                                                <p className="w-full font-md text-sm text-red-600">Seems like email doesn't exist. Make sure that you have created an account before trying again !</p>
                                            }
                                        </div>
                                        :
                                        <div className="col-span-3 sm:col-span-3 flex flex-col gap-2">
                                            <p className="w-full text-lg font-medium">Link to reset your password was sent ! <br/> Please check your email. </p>
                                        </div>
                                    }                                    
                                </div>                                        
                                
                            </div>

                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    type="submit"
                                    onClick={handleEmail}
                                    className="inline-flex text-white justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-red bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {
                                        (!emailStat)
                                        ?
                                        <p>Next</p>
                                        :
                                        <p>Resend</p>                                        
                                    }
                                </button>                                
                            </div>
                        </div>
                    {/* </form> */}
                </div>                
            </div>            
        </div>
    )
}

export default ForgotPassword;