import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "/src/assets/css/App.css";
import {genUUID, UserAgent} from "./utils/reader.js";
import {AuthLayout, ProtectedLayout, VisitorsLayout} from "./layouts"
import Home from "./pages/Home.jsx";
import SignUp from "./pages/auth/signup";
import Notification from "./pages/Notification";
import {Inbox} from "./pages/Inbox";
import Login from "./pages/auth/login.jsx";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject.jsx";
import Issues from "./components/Issues/index.jsx";
import Issue from "./components/Issue";
import UserProfile from "./pages/UserProfile.jsx";
import NotFound from "./pages/NotFound.jsx";
import NewIssue from "./pages/NewIssue";
import {FloatingMenu} from "./components/FloatingMenu";
import {ReactNotifications} from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css/animate.min.css";
import ResourceRelay from "./pages/ResourceRelay";
import OutlinerTest from "./components/Outliner/test.jsx";
import SettingsLayout from "./layouts/SettingsLayout.jsx";
import ProjectLayout from "./layouts/ProjectLayout.jsx";
import PersonalSettings from "./components/PersonalSettings/index.jsx";
import TeamSettings from "./components/TeamSettings/index.jsx";
import AddPrice from "./components/AddPrice/index.jsx";
import PaymentStatus from "./components/PaymentStatus/index.jsx"
import Bazaar from "./pages/Bazaar.jsx";
import Bento from "./pages/Bento.jsx";
import PaymentReturn from "./pages/paymentReturn.jsx";
import BazaarProfile from "./pages/BazaarProfile.jsx";
import PurchaseHistory from "./pages/PurchaseHistory";
import DetailRelay from "./pages/DetailRelay.jsx";
import ResetPassword from "./pages/ResetPasword.jsx";
import ProjectSettings from "./components/ProjectSettings/index.jsx";
import Collaborators from "./components/Collaborators/index.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import IntroPage from "./components/IntroPage/index.jsx";
import Tester from "./pages/tester/test.jsx";
import Premium from "./components/Premium/index.jsx";
import PaypalDemo from "./components/PaypalDemo"
import {useEffect, useRef, useState} from "react";
import {useAppSelector} from "./redux/hooks.js";
import {getBackendURL} from "./utils/reader.js";
import CheckIn from "./pages/CheckIn.jsx";
import Train from "./pages/Train.jsx";
import InferDemo from "./pages/InferDemo.jsx";
import {
    INFER_MESSAGE, PRIVATE_MESSAGE,
} from "./redux/constants/notificationConstants.js";
import AISTATUS from "../../share/AISTATUS.mjs";
import {useAppDispatch} from "./redux/hooks";
import {
    inferStart,
    inferEnd,
    inferError,
    uploadEnd,
    inferUpdateProgress,
    inferUpdateDetail, messageRecv
} from "./redux/actions/notification.js";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {FileContext} from "./utils/context.js";

export default function App() {
    const {user, isLoggedIn} = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [filesObj, setFilesObj] = useState(null) //{uuid:files}
    const fileUUIDRef = useRef(null);

    const [sseType, setSSEType] = useState(null);
    const createSSE = (token, onmessage) => {
        const url = new URL("/api/notification/SSE", getBackendURL());

        // https://www.youtube.com/watch?v=GXGFCXn9Hak&ab_channel=Covalence
        fetchEventSource(url.href, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            openWhenHidden: true,
            onerror: e => {
                console.error(e);
            },
            onmessage
        })
    };

    const deleteSSE = _ => {

    };

    const handleMessage = (message) => {
        if (message?.type === INFER_MESSAGE) {
            switch (message?.status) {
                case AISTATUS.inferStart:
                    dispatch(inferStart(message.uuid, message.user_id));
                    break;
                case AISTATUS.inferUpdateProgress:
                    dispatch(inferUpdateProgress(message.uuid, message.user_id, message.result));
                    break
                case AISTATUS.inferUpdateDetail:
                    fileUUIDRef.current = message.uuid;
                    dispatch(inferUpdateDetail(message.uuid, message.user_id, message.result));
                    break
                case AISTATUS.inferEnd:
                    dispatch(inferEnd(message.uuid, message.user_id));
                    break
                case AISTATUS.uploadEnd:
                    dispatch(uploadEnd(message.uuid, message.user_id, message.result));
                    break
                case AISTATUS.inferError:
                    dispatch(inferError(message.uuid, message.user_id, message.result));
                    break
                default:
                    break
            }
        } else if (message.type === PRIVATE_MESSAGE) {
            dispatch(messageRecv(message.sender_id, message, message.type));
        }
    }

    const initApp = _ => {
        const ua = new UserAgent();

        const bc = new BroadcastChannel('test channel');
        const app = JSON.parse(localStorage.getItem("app"));
        let tab;
        // remove tab from app when tab is closed
        window.addEventListener("beforeunload", _ => {
            const app = JSON.parse(localStorage.getItem("app") ?? JSON.stringify({tabs: []}));

            app.tabs = app.tabs.filter(({uuid}) => uuid !== tab.uuid);
            bc.close();
            localStorage.setItem("app", JSON.stringify(app));

        })
        if (!app || app.tabs.length === 0) { //init
            tab = {uuid: genUUID(), type: 'master'};
            const device = {uuid: genUUID(), ua};
            const app = {device: [device], version: 'xxxx', tabs: [tab]};
            localStorage.setItem("app", JSON.stringify(app));
            return {type: 'master', bc};
        } else {
            tab = {uuid: genUUID(), type: 'slave'};
            const app = JSON.parse(localStorage.getItem("app") ?? JSON.stringify({tabs: []}));
            app.tabs.push(tab);
            localStorage.setItem("app", JSON.stringify(app));

            return {type: 'slave', bc};
        }
    };

    const run_once = useRef(true);
    useEffect(() => {
        if (!run_once.current) return;

        run_once.current = false;

        if (isLoggedIn) {
            const {bc, type} = initApp();
            if (type === 'master') {
                createSSE(user.loginToken, evt => {
                    if (evt.event === 'json') {
                        console.log("From SSE:" + evt.data);
                        const message = JSON.parse(evt.data);
                        handleMessage(message);
                        bc.postMessage(message);
                    } else if (evt.event === 'base64') {
                        console.log("Receive Base64 from sse")
                        // debugger;

                        // there contains several choice
                        // 1. make base64 to blob and store it in the indexeddb?
                        // 2. store base64 in the indexeddb, someday we take it out and make it to blob,then ,put it back
                        // 3. just store it in state
                        // 4. store the base64 in indexeddb, then pass the url

                        // below is the 3rd choice
                        // todo: use the 4th choice
                        // todo: postMessage to slave

                        if (fileUUIDRef.current) {
                            setFilesObj(prevFilesObj => {
                                const currentFiles = prevFilesObj?.[fileUUIDRef.current] ?? [];
                                const updatedFiles = [...currentFiles, evt.data];
                                console.log('Current Files:', currentFiles);
                                console.log('Updated Files:', updatedFiles);
                                // todo : contains a problem here,the useState is async,so the currentFiles is always the []
                                // maybe I could count every preview
                                return {...prevFilesObj, [fileUUIDRef.current]: updatedFiles};
                            });
                        }
                    }
                });
            } else if (type === 'slave')
                bc.onmessage = evt => {
                    console.log("From BC-SSE:" + evt.data);
                    // todo: how to handle the preview
                    handleMessage(evt.data);
                };
        } else {
            deleteSSE();
        }
    }, [isLoggedIn, run_once.current]);

    useEffect(() => {
        console.log("=========filesObj", filesObj);
    }, [filesObj]);

    return (
        <FileContext.Provider value={filesObj}>
            <Router>
                <div className="w-full h-screen overflow-y-auto">
                    <ReactNotifications/>
                    <Routes>
                        <Route element={<FloatingMenu/>}>
                            <Route path="/" element={<Home/>}></Route>
                            <Route path="/@:username" element={<UserProfile/>}></Route>
                            <Route path="/@:username/:uuid" element={<DetailRelay/>}></Route>
                            <Route path="/bazaar" element={<Bazaar/>}></Route>
                            <Route path="/bazaar/profile" element={<BazaarProfile/>}></Route>
                            <Route path="/outliner" element={<OutlinerTest/>}></Route>
                            <Route path="/premium" element={<Premium/>}></Route>
                        </Route>

                        <Route element={<AuthLayout/>}>
                            <Route path="/signup" element={<SignUp/>}></Route>
                            <Route path="/login" element={<Login/>}></Route>
                        </Route>

                        <Route element={<ProtectedLayout/>}>
                            <Route element={<FloatingMenu/>}>
                                <Route path="/payment/success" element={<PaymentReturn/>}></Route>
                                <Route path="/bento" element={<Bento/>}></Route>
                                <Route path="/post/:uuid" element={<ResourceRelay/>}></Route>
                                <Route path="/product/:uuid" element={<ResourceRelay/>}></Route>
                                <Route path="/project/:uuid" element={<ResourceRelay/>}></Route>
                                <Route path="/train/:uuid" element={<Train/>}></Route>
                                <Route path="/infer" element={<InferDemo/>}></Route>
                                <Route path="/:user/projects" element={<Projects/>}></Route>
                                <Route path="/train" element={<Train/>}></Route>
                                <Route path="/:user-:project">
                                    <Route index element={<OutlinerTest/>}/>

                                    <Route path="issues">
                                        <Route index element={<Issues/>}></Route>
                                        <Route path=":id" element={<Issue/>}></Route>
                                        <Route path="new" element={<NewIssue/>}></Route>
                                    </Route>

                                    <Route path="settings" element={<ProjectLayout/>}>
                                        <Route path="project" element={<ProjectSettings/>}></Route>
                                        <Route path="collaborators" element={<Collaborators/>}></Route>
                                    </Route>
                                </Route>

                                <Route exact path="/settings" element={<SettingsLayout/>}>
                                    <Route path="personal" element={<PersonalSettings/>}></Route>
                                    <Route path="team" element={<TeamSettings/>}></Route>
                                    <Route path="project" element={<PersonalSettings/>}></Route>
                                    <Route path="notification" element={<PersonalSettings/>}></Route>
                                    <Route path="history" element={<PurchaseHistory/>}></ Route>
                                </Route>


                                <Route path="/notification" element={<Notification/>}></Route>
                                <Route path="/inbox" element={<Inbox/>}></Route>
                                <Route path="/newProject" element={<NewProject/>}></Route>
                                <Route path="*" element={<NotFound/>}></Route>

                                <Route path="/addPrice" element={<AddPrice/>}></Route>
                                <Route path="/payment/:paymentState/:redirectURL" element={<PaymentStatus/>}></Route>

                                <Route path="/paypalDemo" element={<PaypalDemo/>}></Route>
                                <Route path="/checkin" element={<CheckIn/>}></Route>

                            </Route>
                        </Route>
                        <Route path="/reset/:token" element={<ResetPassword/>}></Route>
                        <Route path="/forgotpass" element={<ForgotPassword/>}></Route>
                        <Route path="/testland" element={<IntroPage/>}></Route>
                        <Route path="/intro" element={<Tester/>}></Route>
                        <Route path="*" element={<NotFound/>}></Route>
                    </Routes>
                </div>
            </Router>
        </FileContext.Provider>
    );
}