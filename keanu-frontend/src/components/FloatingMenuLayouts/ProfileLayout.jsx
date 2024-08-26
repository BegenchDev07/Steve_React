import { useState,useEffect } from "react";
import { genMenuBtn } from "./common";

const ProfileLayout = ({menu,expandClick,redirect}) => {
    const [mainMenu, setMainMenu] = useState(menu.slice(0,1))
    const [subMenu, setSubMenu] = useState(menu.slice(1,menu.length))    
     useEffect(()=>{
        
        
    },[])
    return(
        <div className="flex gap-3">
        {genMenuBtn(mainMenu[0], expandClick, redirect)}
        <div className="w-auto px-1 flex items-center justify-center gap-3 bg-zinc-800/40 rounded-md">

            <div className="w-auto h-full flex items-center justify-center gap-3 py-1">
                {subMenu.map(element=>(<>{genMenuBtn(element, expandClick, redirect)}</>))}
            </div>        
        </div>
        </div>

    )
}

export default ProfileLayout;