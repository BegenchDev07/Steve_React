import personalIcon from '../assets/icons/personal.svg';
import teamIcon from '../assets/icons/team.svg';
import projectIcon from '../assets/icons/project.svg';
import notificationIcon from '../assets/icons/notification.svg';
import { useNavigate,Outlet,useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import path from 'path';

const SettingsLayout = () => {
    const navigator = useNavigate();
    const {pathname} = useLocation();
    const [breadcrumb, setBreadcrumb] = useState(pathname.split('/').filter(ele => {return ele != ''}))        
    
    //for endpoints below the ids are expeted to be provided for now dummy ones are implemented
    // /settings/personal/:userID 
    // /settings/team/:teamID     
    // /settings/project/:projectID   
    const currentButton = () => {
        if(pathname.split('/').includes('personal'))        
            return true
        else 
            return false
    }
    useEffect(()=>{        
        setBreadcrumb(pathname.split('/').filter(ele => {return ele != ''}))
        currentButton()
    },[pathname])
    return(
        <>
            <div className="w-full h-full">
                <div className="w-full flex flex-cols-2 py-4">
                    <div className="col-start-1 col-span-1 w-1/5 h-screen gap-10 flex flex-col items-start pl-4">
                        <div className='w-full'>
                            <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">                                
                                {
                                    breadcrumb.map((result,index)=>{
                                        return(
                                        <li key={index}>
                                        <div className="flex items-center">
                                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                            </svg>
                                            <span className="ms-1 text-sm font-medium text-gray-700 md:ms-2">{result}</span>
                                        </div>
                                        </li>
                                        )
                                    })
                                }
                                {/* <li aria-current="page">
                                <div className="flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Flowbite</span>
                                </div>
                                </li> */}
                            </ol>
                            </nav>
                        </div>
                        <button onClick={()=>{navigator('/settings/personal')}} className={`py-4 flex items-center gap-3 w-full rounded-lg px-3 hover:bg-gray-200 ${(currentButton()) && "bg-gray-300"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            Personal 
                        </button>
                        <button onClick={()=>{navigator('/settings/team')}} className="py-4 flex items-center gap-3 w-full rounded-lg px-3 hover:bg-gray-200 focus:bg-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            Team 
                        </button>
                        <button onClick={()=>{navigator('/settings/project')}} className="py-4 flex items-center gap-3 w-full rounded-lg px-3 hover:bg-gray-200 focus:bg-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-git-2"><path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"/><circle cx="13" cy="12" r="2"/><path d="M18 19c-2.8 0-5-2.2-5-5v8"/><circle cx="20" cy="19" r="2"/></svg>
                            Project 
                        </button>
                        <button onClick={()=>{navigator('/settings/notification')}} className="py-4 flex items-center gap-3 w-full rounded-lg px-3 hover:bg-gray-200 focus:bg-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-ring"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
                            Notification 
                        </button>
                        <button onClick={()=>{navigator('/settings/history')}} className="py-4 flex items-center gap-3 w-full rounded-lg px-3 hover:bg-gray-200 focus:bg-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>
                            History 
                        </button>
                    </div>
                    <div className="col-start-2 col-span-1 w-4/5 h-screen py-4">                    
                        <Outlet/>                                               
                    </div>
                </div>
            </div>
        </>
    )

}
export default SettingsLayout;