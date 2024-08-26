import TableMenu from "./TableMenu";
import SendMsgLayout from "../SendMsgLayout.jsx";
import {TYPES} from "/src/redux/actions/menu";


export default function ExpandMenuLayout({menu, onRedirect}) {

    const relayLogic = (data) => {
        if (data === null) return (<></>) //close menu
        const {type, name} = menu;
        switch (type) {

            case type & TYPES.rootmenu:
                return (<TableMenu key={name} menu={data} onRedirect={onRedirect}/>)//
            case type & TYPES.expandmenu:
                return (<TableMenu key={name} menu={data} onRedirect={onRedirect}/>)//
            case type & TYPES.sendmsgmenu:
                return (<SendMsgLayout key={name}/>)//
            default: {
                debugger;
                return (<></>) //close menu
            }
        }
    }
    return (<>{relayLogic(menu)}</>);
}
