import {useState} from "react";

import {genMenuBtn} from "./common";

const RootLayout = ({menu, expandClick, redirect}) => {
    const [mainMenu, setMainMenu] = useState(menu.slice(0, 1))
    const [subMenu, setSubMenu] = useState(menu.slice(1, menu.length))

    return (
        <>
            {genMenuBtn(mainMenu[0], expandClick, redirect)}
            <div className="w-auto px-1 flex items-center justify-center gap-3 bg-zinc-800/40 rounded-md py-1">
                {subMenu.map(element => (<>{genMenuBtn(element, expandClick, redirect)}</>))}
            </div>
        </>
    )
}

export default RootLayout;