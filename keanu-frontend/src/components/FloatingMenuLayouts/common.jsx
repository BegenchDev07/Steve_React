import {parseURL, TYPES} from "/src/redux/actions/menu";
import AvatarImage from "/src/components/AvatarImage";
import {MENU_RESOURCE_FEEDBACK} from "../../redux/constants/menuConstants";
import HomeSVG from '../../assets/icons/home.svg';

const css = {
    Menu: "rounded-md w-auto h-full text-sm font-semibold text-white flex bg-black items-center justify-center px-2 gap-2",
    SubMenu: "items-center h-full justify-center gap-1 w-auto px-2 bg-zinc-800/60 text-white text-lg hover:border-t-2 hover:border-white  focus:border-t-2 focus:border-white",

    STATE_BTN_ON: "items-center h-full justify-center gap-1 w-auto px-2 bg-zinc-800/60 text-white text-lg  border-t-2 border-red-400",
    STATE_BTN_OFF: "items-center h-full justify-center gap-1 w-auto px-2 bg-zinc-800/60 text-white text-lg border-red-400 hover:border-t-2 hover:border-white",

    SCROLL:'text-white h-full px-1 rounded-md border border-white hover:border-yellow-500 focus:border-yellow-500',

    // CART_ACTION:'',

    ACTIONS:{
        Cart:'items-center h-full flex justify-center gap-1 w-auto px-2 bg-blue-600 text-white text-lg rounded-md border-white border'
    }

}

const prevPage = dispatch => {
    dispatch({
        type: "MENU_NAVI",
        payload: {value: 'prev'},
    });

}

const nextPage = dispatch => {
    dispatch({
        type: "MENU_NAVI",
        payload: {value: 'next'},
    });
}

const scrollHelper = (id) => {
    document.getElementById(5).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
}

export const buttonHandler = (dispatch,element,state, redirect) => {
    const hoverFunc = (icon,e) => {        
        if(icon['hover'] != undefined){
            e.currentTarget.childNodes[0].src = icon['hover'];            
        }
    }

    const stillFunc = (icon,e) => {        
        if(icon['still'] != undefined){
            e.currentTarget.childNodes[0].src = icon['still'];            
        }
    }
    const renderIcon = (icon) => {
        if(icon['still'] != undefined)
            return(<img className="py-1 px-1 h-full w-12 h-12" src={icon.still} alt="" />)
        else if(icon)
            return(<img className="py-1 px-1 h-full w-12 h-12" src={icon} alt="" />)                    
    }
    const {id, type, name, url, value, icon,title} = element;
    switch (type) {        
        
        case type & TYPES.inboxbutton:
            return (
                <button
                    key={element.name}
                    onClick={evt => redirect(parseURL(url))}
                    className="w-12 h-full border border-gray-500 rounded py-1 text-center no-underline text-white"
                >
                    {name}
                </button>
            )

        case type & TYPES.navbutton:
            return (
                <button
                    key={element.name}
                    onClick={evt => redirect(parseURL(url))}
                    className={css.SubMenu}
                    onMouseEnter={(e)=>{hoverFunc(icon,e)}}
                    onMouseLeave={(e)=>{stillFunc(icon,e)}}
                >
                    {title??''}
                    {renderIcon(icon)}                    

                </button>
            )

        case type & TYPES.nextPrevbutton:
            return (
                <button
                    key={element.name}
                    onClick={(value === 'next') ? () => nextPage(dispatch) : () => prevPage(dispatch)}
                    className="w-full h-full border border-gray-500 rounded py-1 text-center no-underline text-white"
                >
                    {name}
                </button>
            )
        case type & TYPES.formbutton:
            return (
                <button
                    key={element.name} form={value} className={css.SubMenu} type="submit" id={id}>
                    {name}
                </button>
            )
        case type & TYPES.scrollbutton:
            return (
                <button
                    key={element.name}
                    className={css.SCROLL}
                    onClick={() => {
                        scrollHelper(id)
                    }} id={id}>
                    {name}
                </button>
            )
        case type & TYPES.filterbutton:
            return (
                <button
                    key={element.name} className={css.SubMenu} id={id}>
                    {name}
                </button>
            )
        case type & TYPES.avatarbutton:
            // todo: add avatar image to localStorage
            return (
                <div key={element.name} className="flex items-center mx-1 gap-2"
                     onClick={evt => redirect(parseURL(url))}>
                    <AvatarImage width={6}/>
                    <h3 className="text-white antialiased font-semibold text-2xl border-b-2 border-gray-500 hover:border-white">
                        {JSON.parse(localStorage.user??JSON.stringify({username:undefined})).username}
                    </h3>
                </div>
            )

        case type & TYPES.actionbutton:
            
            return (
                <button
                    key={element.name} className={css.SubMenu} id={id}>
                    {(icon) ? <img className="py-1 px-1 h-full" src={icon} alt="" /> : title}

                </button>
            )

        case type & TYPES.statebutton:

            const btnValue = state===null?false:(!!state[element.name]);
            return (
                <button
                    value={btnValue.toString()}
                    key={element.name} className={btnValue?css.STATE_BTN_ON:css.STATE_BTN_OFF} id={id}

                    onClick = {evt=>{
                        const target =  evt.currentTarget;
                        const value = !(target.value === 'true');
                        target.value = value;
                        if(value)
                            target.classList.add('border-t-2');
                        else
                            target.classList.remove('border-t-2');

                        if(state){//initialized from redux
                            const fnc =  element.value;
                            fnc(dispatch,{value,...state})
                                .then(_=>    dispatch({
                                    type: MENU_RESOURCE_FEEDBACK,
                                    payload: { feedback: {[element.name]:value}},
                                }))
                        }
                    }}>
                    {(icon) ? <img className="py-1 h-full w-10 px-1" src={icon} alt="" /> : title}
                </button>
            )
    }
}

export const genMenuBtn = (dispatch, element,state, expandClk, redirect) => {
    const {id, type, name, icon} = element;

    switch (element.type) {


        case type & TYPES.rootmenu:
            // debugger;
            return (
                <button key={name} className={css.Menu} id={id} onClick={expandClk}>
                    <a href="/">
                        <img src={icon} className='w-8 h-8' alt=""/>
                    </a>
                    gamehub.cloud
                </button>)

        case type & TYPES.expandmenu:
            return (
                <button key={name} className={css.SubMenu} id={id} onClick={expandClk}>
                    {name}
                </button>
            )


        case type & TYPES.sendmsgmenu:
            return (
                <button key={name} className={css.SubMenu} id={id} onClick={expandClk}>
                    {name}
                </button>
            )










        case type & TYPES.button:
            return (<>{buttonHandler(dispatch, element,state, redirect)}</>)
        case type & TYPES.text:
            return (
                <p key={name} className="flex">
                    {name}
                </p>
            )

        default:
            break;
    }
}