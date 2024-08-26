import {forwardRef, Fragment, useEffect} from "react";
import {genMenuBtn} from "./common";
import {useAppDispatch} from "../../redux/hooks.js";
import {TYPES} from "../../redux/actions/menu.js";

const DefaultLayout = forwardRef(({menuList, state, expandClick, onRedirect, onConnect}, ref) => {
    const dispatch = useAppDispatch();

    const renderContainer = element => element.children.map((ele, index) => (
            <Fragment key={index}>{genMenuBtn(dispatch, ele, state, expandClick, onRedirect)}</Fragment>)),
        renderComp = element => (<>{genMenuBtn(dispatch, element, state, expandClick, onRedirect)}</>);

    const render = element => {
        return (element.type & TYPES.container) ?
            (<div key={"container"}
                  className="flex h-full w-auto bg-zinc-800/40 rounded-md py-1 px-1">{renderContainer(element)}</div>) :
            (<>{renderComp(element)}</>);
    }

    useEffect(_ => onConnect(), [ref.current]);

    return (
        <div className="flex gap-3" ref={ref}>
            {/*{genMenuBtn(dispatch,mainMenu[0], expandClick, onRedirect, dispatch)}*/}
            <div className="w-auto px-1 flex items-center justify-center gap-3 rounded-md py-1">
                {menuList.map((element, index) => {
                    return (
                        <Fragment key={index}>{
                            render(element)
                        }   </Fragment>)
                })}
            </div>
        </div>
    )
});

export default DefaultLayout;