import {menuList, parseURL, TYPES} from "/src/redux/actions/menu";
import {useNavigate} from "react-router-dom";
import {$getDocsNodes} from "/src/utils/reader";
import {useAppDispatch} from "../../redux/hooks.js";

const TableMenu = ({menu, onRedirect}) => {
    const dispatch = useAppDispatch();
    const nodes = [];
    for (const subMenu of menuList)
        nodes.push(...$getDocsNodes(subMenu));

    const navigator = useNavigate();

    const click = evt => {
        const targetID = evt.currentTarget.id,
            node = nodes.find(({id}) => id === targetID);
        if (node.url)
            navigator(parseURL(node.url));
    }
    const checkForType = (element) => {
        const {type, url, name} = element;
        switch (type) {
            case type & TYPES.navbutton:
                return (
                    <button
                        className="hover:text-green-600 hover:font-semibold"
                        key={element.name}
                        onClick={evt => {
                            onRedirect(parseURL(url))
                        }}
                    >
                        {name}
                    </button>
                )
            case type & TYPES.titletext:
                return (
                    <p
                        key={name}
                        className="flex">
                        {name}
                    </p>
                )
            default:
                break;
        }
    }


    return (<>
        <div
            className=" w-full flex flex-col text-white h-40 bg-zinc-700/85 z-10 rounded-lg px-3 py-1">
            <div className="w-auto text-start grid grid-cols-3 justify-items-center gap-4">
                {
                    menu.children.map((menuTitle, index) => {
                        return (
                            <div key={index} className="flex flex-col">
                                <ul className="text-white border-b border-dashed decoration-pink-500 font-semibold py-0.5">
                                    <li className="text-lg">
                                        {menuTitle.name}
                                    </li>
                                </ul>
                                <div className="flex flex-col items-start">
                                    {menuTitle.children.map((subMenuEle, index) => checkForType(subMenuEle, index))}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </>)

}

export default TableMenu;