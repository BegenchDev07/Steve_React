import SDMessage from "./SDMessage.jsx";
import PrivateMessage from "./PrivateMessage.jsx";
import ProjectInvitationMessage from "./ProjectInvitationMessage.jsx";
import ProgressMessage from "./ProgressMessage.jsx";
import {SD_LAYOUT} from "../../constants/LayoutConstant.js";
import {
    PRIVATE_MESSAGE,
    PROJECT_INVITATION, SD_CLIENT_INFER_PREVIEW, SD_CLIENT_INFER_PROGRESS,
    SD_CLIENT_INFER_REQ,
    SD_CLIENT_INFER_RES
} from "../../redux/constants/notificationConstants.js";
import AvatarImage from "../AvatarImage/index.jsx";
import React, {useState} from "react";

export default function Message({username,message, setMessageObj}) {
    const [isShow, setIsShow] = useState(true);

    const renderMessageBody = _ => {
        switch (message.type) {
            case PRIVATE_MESSAGE:
                return <PrivateMessage message={message}/>;
            case PROJECT_INVITATION:
                return <ProjectInvitationMessage message={message}/>;
            case SD_CLIENT_INFER_REQ:
                return <SDMessage message={message} setMessageObj={setMessageObj} type={SD_LAYOUT.SD_REQ_NALLOW}/>;
            case SD_CLIENT_INFER_RES:
                return <SDMessage message={message} setMessageObj={setMessageObj} type={SD_LAYOUT.SD_RES_NALLOW}/>;
            case SD_CLIENT_INFER_PREVIEW:
                return <SDMessage message={message} setMessageObj={setMessageObj} type={SD_LAYOUT.SD_PREVIEW_NALLOW}/>;
            case SD_CLIENT_INFER_PROGRESS:
                return <ProgressMessage message={message} setIsShow={setIsShow}/>
            default:
                return <div>Unknown message type</div>;
        }
    }

    if (isShow) {
        return (
            <div
                className={`flex flex-row items-center gap-2 ${message.sender.username === username ? 'flex-row-reverse' : ''}`}>
                <div className="flex flex-col flex-shrink-0 items-center justify-center">
                    <AvatarImage width={12} avatar={message.sender.username}/>
                    {/*<h3 className="font-thin text-2xl">{message.sender.username}</h3>*/}
                </div>
                <div>
                    {renderMessageBody()}
                </div>
            </div>
        )
    }
}