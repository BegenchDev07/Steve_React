import AvatarImage from "../AvatarImage/index.jsx";
import React from "react";

export default function ProjectInvitationMessage ({message}){
    return (
        <a
            href="https://www.baidu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
            key={message.id}
        >
            <div className="flex items-center mb-4">
                <div className="flex flex-col items-center">
                    <AvatarImage width={12} avatar={message.content.invitor}/>
                    <div className="text-sm text-gray-600 mt-2">{message.content.invitor}</div>
                </div>
                <div className="ml-4 flex-1">
                    <div className="text-lg">
                        {message.content.invitor} invites you to join {message.content.project_id}
                    </div>
                    <div className="text-gray-500 text-sm mt-2 text-right">
                        {message.update_time.substring(5, 10) + " " + message.update_time.substring(11, 16)}
                    </div>
                </div>
            </div>
        </a>
    )
}