import {$match} from "../../utils/reader";
import {appendDraft, clearDraft} from "../../utils/urlOperation.js";

import HomeSVG from "../../assets/icons/home.svg";

import SubsSVG from "../../assets/icons/share-2.svg"
import CartSVG from "../../assets/icons/shopping-basket.svg";
import GameHubIcon from '../../assets/icons/common/gamehub.svg';


import PostSVG from "../../assets/icons/floatingMenu/post+.svg";
import ProductSVG from "../../assets/icons/floatingMenu/product+.svg";
import ProjSVG from "../../assets/icons/floatingMenu/project+.svg";

import PostFillSVG from '../../assets/icons/common/post.svg'
import ProductFillSVG from '../../assets/icons/common/product.svg'
import ProjFillSVG from '../../assets/icons/common/project.svg'

import {apiCatcher} from "../../utils/apiChecker";

import HeartSVG from '../../assets/icons/Heart.svg';
import {getBackendURL} from "../../utils/reader.js";
import keanuFetch from "../../utils/keanuFetch.js";
import {load} from "../../utils/storageOperation.js";

const fetch = keanuFetch();
const genID = (ele, parentid = '') => {
    ele.id = parentid ? `${parentid}|${ele.name}` : ele.name;
    for (const child of ele.children ?? [])
        genID(child, ele.id)
}

const getUsr = () => {
    const {username} = JSON.parse(localStorage.getItem('user')) ?? '';
    if (username !== '') return username;
    return null;
}

const _check = (url) => {
    const
        [rootURL,] = $match(REGEX_PARSE_ROOT, url),
        [, usrName] = rootURL.split('/@');

    if (url.split('/').length > 2)
        return url.split('/')[2];

    return `@${usrName}`;

}

const postChecker = (url, state = 'CUR_USR') => {
    if (!url.startsWith('/@')) return false;
    const data = _check(url);

    if (state === 'CUR_USR')
        return data === `@${getUsr()}`;
    else if (state === 'OTHER_USR') {
        return data.startsWith('@');
    } else if (state === 'UUID')
        return true;
    else if (state === 'DRAFT' && url.endsWith('-DRAFT'))
        return true;
}

const urlRouter = [
    {router: _ => !JSON.parse(localStorage.getItem('user')), subMenu: '#login'},//checkLogin
    {router: '/', subMenu: '#root'},
    {router: postChecker, subMenu: '#{CUR_USR}'},
    {router: url => postChecker(url, 'OTHER_USR'), subMenu: '#{OTHER_USR}'},
    {router: url => postChecker(url, "DRAFT"), subMenu: '#draftPost'},
    {router: url => postChecker(url, 'UUID'), subMenu: '#{RESOURCE}'},


    {router: url => /\/post\/(.+)/gm.test(url), subMenu: '#editPost'},
    {router: url => /\/product\/(.+)/gm.test(url), subMenu: '#editPost'},
    {router: url => /\/project\/(.+)/gm.test(url), subMenu: '#editPost'},

    {router: url => url.split('-').length === 2, subMenu: '#project'},

    {router: '/settings/personal', subMenu: '#personal'},

    {router: _ => true, subMenu: '#notFound'},
]

const classify = type => {
    const filtered = Object.entries(TYPES)
        .filter(([key, value]) => new RegExp(type).test(key))
    TYPES[type] = filtered.reduce((acc, [key, value]) => acc + value, 0);
}
const TYPES = {

    menu: 0,

    rootmenu: Math.pow(2, 0),
    expandmenu: Math.pow(2, 1),
    sendmsgmenu: Math.pow(2, 2),

    button: 0,
    homebutton: Math.pow(2, 7),
    inboxbutton: Math.pow(2, 8),
    navbutton: Math.pow(2, 9),
    formbutton: Math.pow(2, 10),
    emptybutton: Math.pow(2, 11),
    filterbutton: Math.pow(2, 12),
    actionbutton: Math.pow(2, 13),
    nextPrevbutton: Math.pow(2, 14),
    scrollbutton: Math.pow(2, 15),
    followbutton: Math.pow(2, 16),
    msgbutton: Math.pow(2, 17),
    avatarbutton: Math.pow(2, 18),

    statebutton:Math.pow(2, 19),

    text: 0,
    titletext: Math.pow(2, 20),
    emojitext: Math.pow(2, 21),

    container: Math.pow(2, 30),
}
classify('menu');
classify('button');
classify('text');

const rootMenu = {
    name: 'rootMenu', type: TYPES.rootmenu, icon: GameHubIcon, children: [
        {
            name: "Recent", type: TYPES.titletext, icon: '', children: [
                {name: "infer", type: TYPES.navbutton, icon: '', url: '/infer'},
                {name: "bazaar", type: TYPES.navbutton, icon: '', url: '/bazaar'},
                {name: "inbox", type: TYPES.navbutton, icon: '', url: '/inbox'},
                {name: "@jennie", type: TYPES.navbutton, icon: '', url: '/@jennie'},
            ]
        },
        {
            name: "Creator", icon: '', type: TYPES.titletext, children: [
                {name: "My Profile", type: TYPES.navbutton, icon: '', url: `/@#{CUR_USR}`},
                {name: "Gallery", type: TYPES.emptybutton, icon: ''},
            ]
        },
        {
            name: "Project", icon: '', type: TYPES.titletext, children: [
                {name: "MyProjects", type: TYPES.navbutton, icon: '', url: `/projects?usr=#{CUR_USR}`},
                {name: "test-Test", type: TYPES.navbutton, icon: '', url: '/test-Test'},
                {name: "Gallery", type: TYPES.emptybutton, icon: ''},
            ]
        },
    ]
};

const layoutCSS = {
    '#root': 'RootLayout',
    // '#{CUR_USR}':'ProfileLayout'
}
const _postFeedback = (type = 'like', username, uuid, value) => {
        return fetch.post(new URL('api/resource/feedback', getBackendURL()), {
            type,
            uuid,
            username,
            value
        });
    },postFeedback = (type,dispatch, state)=> {
        const { username, uuid, value} = state;
        return apiCatcher(dispatch, _postFeedback, type, username, uuid, (value ? 1 : -1));

    }
// https://codesandbox.io/p/sandbox/14lxm6jmm7?file=%2Fsrc%2FMenu.js%3A38%2C40
//horizontal menu
const menus = [
    {
        name: '#login', children: [//no rootMenu
            {name:'login',title: 'Login', icon: '', type: TYPES.navbutton, url: '/login'},
        ]
    },
    {
        name: '#root', children: [
            rootMenu,
            {name: 'avartar', icon: '', type: TYPES.avatarbutton, url: `/@#{CUR_USR}`},

            // {name:'${TODO_filter}', icon:'', type:TYPES.filterbutton, value:'tags={usr/proj/gameGenre}'},

            // {name: '${#1}', icon: '', type: TYPES.scrollbutton, value: '#1'},
            // {name: '${#2}', icon: '', type: TYPES.scrollbutton, value: '#2'},
            // {name: '${#3}', icon: '', type: TYPES.scrollbutton, value: '#3'},

            {
                name: "Create", type: TYPES.expandmenu, icon: '', children: [
                    {
                        name: "Create", icon: '', type: TYPES.titletext, children: [
                            {name: "Post", type: TYPES.navbutton, icon: '', url: '/post/0'},
                            {name: "Product", type: TYPES.navbutton, icon: '', url: '/product/0'},
                            {name: "Project", type: TYPES.navbutton, icon: '', url: '/project/0'},
                            {name: "Train", type: TYPES.navbutton, icon: '', url: '/train/0'}
                        ]
                    },]
            },
            // {name: "Inbox", type: TYPES.inboxbutton, icon: ''},
        ]
    },
    {
        name: '#project', children: [
            {name: 'home', icon: HomeSVG, type: TYPES.homebutton, url: `/`},
            rootMenu,
            {name: "createProj", title: "Create", type: TYPES.navbutton, icon: '', url: '/'},
            {name: "issues",title: "Issues", type: TYPES.navbutton, icon: '', url: '/#{CUR_PROJECT}/issues'},
            {name: "setting",title: "Setting", type: TYPES.navbutton, icon: '', url: '/#{CUR_PROJECT}/settings'},
            // {name: "Inbox", type: TYPES.inboxbutton, icon: ''},
        ]
    },
    {
        name: '#editPost', children: [
            {name: 'home', icon: HomeSVG, type: TYPES.navbutton, url: `/`},
            rootMenu,
            // {name: 'Previous', icon: '', type: TYPES.nextPrevbutton, value: 'previous'},
            // {name: 'Next', icon: '', type: TYPES.nextPrevbutton, value: 'next'},
            {name: "preview", title:'Preview',type: TYPES.navbutton, icon: '', url: '/@#{CUR_USR}/#{CUR_PREVIEW_UUID}'},
            {name: 'Submit', icon: '', type: TYPES.formbutton, value: 'submitForm'},
            // {name: "Inbox", type: TYPES.inboxbutton, icon: ''},
        ]
    },
    {
        name: '#{CUR_USR}', children: [
            {name: 'home', icon: HomeSVG, type: TYPES.navbutton, url: `/`},
            rootMenu,
            {name: 'container', icon: '', type: TYPES.container, children:[

                    {name: "Create Post", type: TYPES.navbutton, icon: {still:PostSVG, hover: PostFillSVG}, url: '/post/0'},
                    {name: "Create Product", type: TYPES.navbutton, icon: {still:ProductSVG,hover:ProductFillSVG}, url: '/product/0'},
                    {name: "Create Project", type: TYPES.navbutton, icon: {still:ProjSVG,hover:ProjFillSVG}, url: '/project/0'},

            ]},

            {name: "Msg", type: TYPES.sendmsgmenu, icon: ''},
        ]
    },
    {
        name: '#{OTHER_USR}', children: [
            {name: 'home', icon: HomeSVG, type: TYPES.navbutton, url: `/`},
            rootMenu,
            {name: "Msg", type: TYPES.sendmsgmenu, icon: ''},

        ]
    },
    {
        name: '#{RESOURCE}', children: [
            {name: 'home', icon: HomeSVG, type: TYPES.navbutton, url: `/`},
            rootMenu,
            // {name:'${filter#1}', icon:'',   type:TYPES.filterbutton, value:'tags={test}'},
            // {
            //     name: 'Favorite', icon: '', type: TYPES.actionbutton, value: _ => {
            //     }
            // },
            // {
            //     name: 'Follow', icon: '', type: TYPES.followbutton, value: _ => {
            //     }
            // },
            {name: 'container', icon: '', type: TYPES.container, children:[
                    // { name: 'favorite', icon: StarSVG, type: TYPES.statebutton,     value: (dispatch, state)=>      postFeedback('favorite',dispatch, state)},
                    { name: 'like',      icon: HeartSVG, type: TYPES.statebutton,   value: (dispatch, state)=>      postFeedback('like',dispatch, state) },
                    { name: 'subscribe', icon: SubsSVG, type: TYPES.statebutton,    value: (dispatch, state)=>      postFeedback('subscribe',dispatch, state) },
            ]},
            { name: 'Comment', title:'Comment', type: TYPES.scrollbutton, value: _ => {}},
            { name: 'Cart', title:'Cart', icon:CartSVG,type: TYPES.actionbutton, value: _ => {}},


            // {name: "Inbox", type: TYPES.inboxbutton, icon: ''},
        ]
    },
    {
        name: '#draftPost', children: [
            {name: 'home', icon: HomeSVG, type: TYPES.navbutton, url: `/`},
            rootMenu,
            {title: "Edit", type: TYPES.navbutton, icon: '', url: '/#{CUR_TYPE}/#{CUR_UUID}'},
            {name: 'Submit', icon: '', type: TYPES.formbutton, value: 'submitForm'},
        ]
    },
    {
        name: '#personal', children: [

            {name: 'home', icon: HomeSVG, type: TYPES.navbutton, url: `/`},
            rootMenu,
            {name: 'Submit', icon: '', type: TYPES.formbutton, value: 'submitForm'},
        ]
    },
    {
        name: '#notFound', children: [

            {name: 'home', icon: HomeSVG, type: TYPES.navbutton, url: `/`},
            rootMenu,
            // {name:'${Search?#1}', icon:'', type:TYPES.filterbutton, value:'tags={test}'},
            // {name: "Inbox", type: TYPES.inboxbutton, icon: ''},
        ]
    }
];

for (const menu of menus)
    genID(menu);

const menuList = menus,
    menuFuncs = {
        'CUR_USR': getUsr,
        'CUR_PROJECT': function () {
            const [project,] = window.location.pathname.split('/').filter(ele => !!ele);
            if (project && project.split('-').length === 2)
                return project;

            return null;
        },
        'CUR_UUID': function () {
            // may exist some risk
            return clearDraft(window.location.pathname.split('/')[2]);
        },
        'CUR_PREVIEW_UUID': function () {
            return appendDraft(window.location.pathname.split('/')[2]);
        },
        'CUR_TYPE': function (){
            // get uuid from url
            const uuid = clearDraft(window.location.pathname.split('/')[2]);
            // search the type by uuid
            return load(uuid, "type");
        }
    };

const REGEX_VAR = /#{(.*?)}/g,
    REGEX_PARSE_ROOT = /\/([^\/])+/gm;

const parseURL = url => {
    return url.replace(REGEX_VAR, (match, target) => {
        if (menuFuncs[target]) {
            return menuFuncs[target]();
        }
        return match;
    });
};

const getRouterMenu = pathname => {
    const {subMenu} = urlRouter.find(({router}) => { if (typeof router === 'string')
            return router === pathname;
        else if (typeof router === 'function')
            return router(pathname);
    });
    return subMenu;
}

export {getRouterMenu, menuList,  parseURL, TYPES, layoutCSS};