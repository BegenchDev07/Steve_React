import {useEffect, useRef, useState,memo} from "react";
import {getRouterMenu, menuList,  TYPES} from "../../redux/actions/menu";
import {useLocation, Outlet, useNavigate} from 'react-router-dom';
import {Header} from "../../components/Header";
import KeanuAlert from "../../components/KeanuAlert";
import DefaultLayout from "../FloatingMenuLayouts/DefaultLayout";
import {ExpandMenuLayout} from "../../layouts"
import "./index.css"
import {useAppSelector} from "../../redux/hooks.js";
import {
    MENU_LOADING_PROGRESS,
    MENU_NAVI,
    MENU_RESOURCE_FEEDBACK,
} from "../../redux/constants/menuConstants";
import {useParams} from "react-router-dom";

function FloatingMenu() {
    const navigator = useNavigate();
    const [menuArr, setMenuArr] = useState(null);

    const ref = useRef(null);
    const childRef = useRef(null);

    const {pathname} = useLocation()
    const [curMenuName, setCurMenuName] = useState(getRouterMenu(pathname));
    const [expMenu, setExpSubMenu] = useState(null);
    const [isMenuExpand, setMenuExpand] = useState(null);
    const [loadingPercentage, setLoadingPercentage] = useState(null);


    const {username, uuid} = useParams();

    const menu = useAppSelector((state) => state.menu);
    const {user,isLoggedIn} =useAppSelector(state=> state.auth);
    const [state, setState] = useState(null);

    useEffect(()=> {
        if(!isLoggedIn)
            setCurMenuName(getRouterMenu(pathname));
    },[user,isLoggedIn]);

    useEffect(() => {
        const {type,status,progress, feedback} = menu;
        switch (type){
            case MENU_LOADING_PROGRESS:
                if(status === 'progress')
                    setLoadingPercentage(progress);
                else if(status === 'start'){

                } else if(status === 'stop'){
                    setLoadingPercentage(null);
                }
                break;
            case MENU_RESOURCE_FEEDBACK:
                setState(prev=>({...prev,...feedback,username,uuid}));
                break;

            case MENU_NAVI:
                break;
            default:
                break;
        }
    }, [menu]);


    const expandClick = event => {
        const menu = menuArr.find(({id}) => id === event.currentTarget.id);
        if (menu.type & TYPES.menu) {
            setExpSubMenu(!isMenuExpand ? menu : null);
            setMenuExpand(!isMenuExpand);
        } else setExpSubMenu(null);
    }

    useEffect(() => {
        if (isMenuExpand)
            window.addEventListener("click", evt => {
                if (!(evt.target.id ?? '').startsWith('#')) {
                    setMenuExpand(false);
                    setExpSubMenu(null); //close menu;
                }
            });

        if (isMenuExpand) {
            ref.current.classList.replace('close_state', 'open_state');
        } else if (isMenuExpand === false) {
            ref.current.classList.replace('open_state', 'close_state');
        }
    }, [isMenuExpand]);

    useEffect(() => {
        setCurMenuName(getRouterMenu(pathname));
        const menuArr = [...menuList.find(element => element.name === curMenuName).children];
        setMenuArr(menuArr);
        initCSS();
    }, [curMenuName, pathname]);

    const _getCSSSelector = (selectorName) => {
        for (const sheet of Array.from(document.styleSheets)) {
            for (const rule of Array.from(sheet.cssRules)) {
                if (rule.selectorText === selectorName)
                    return rule;
            }
        }
        return null;
    }

    const onConnect = _ => {
        console.log('onConnect');
        const width = ref.current.getBoundingClientRect().width;
        _getCSSSelector('.close_state').style['width'] = `${width}px`;
    }



    const initCSS = () => {
        console.log('initCSS');
        _getCSSSelector('.close_state').style['width'] = 'auto';
    }

    const onRedirect = url => {
        // initCSS();
        navigator(url)
    }

    return (<>
        <Header/>
        <KeanuAlert/>

        

        <div className="w-full flex items-center justify-center ">

            <div className="close_state fixed bottom-8 flex flex-col justify-center items-center z-20 bg-zinc-600/80 rounded-lg" ref={ref}>


                <div className="w-full h-full flex flex-col justify-start gap-2 px-1.5 py-1.5 z-10">
                    <ExpandMenuLayout menu={expMenu} type={null} onRedirect={onRedirect}/>
                        {
                            (loadingPercentage != null)
                            &&
                            <div  className="w-full absolute left-0 -top-1.5 rounded-full bg-red-600 h-1 flex text-white"
                                style={{width: `${loadingPercentage*100}%`}}>
                            </div>                    
                        }

                    <div className="w-full flex gap-3 h-14">
                        {menuArr &&
                            <DefaultLayout ref={childRef} onConnect={onConnect} menuList={menuArr} state={state} expandClick={expandClick}
                                           onRedirect={onRedirect}/>
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className="flex relative w-full h-auto">
            <Outlet/>
        </div>
    </>)
}


export default memo(FloatingMenu);