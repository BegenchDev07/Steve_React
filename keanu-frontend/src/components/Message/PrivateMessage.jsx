import React from "react";

export default function PrivateMessage({message}) {
    return (
        <>
            <div className="flex items-center gap-3" key={message.id}>
                <div className="w-full h-full flex bg-green-500 text-white rounded-md px-3 py-1">
                    <p className="flex w-full items-start">{message.content.text}</p>
                </div>
                <div className="ml-auto whitespace-nowrap text-xs"></div>
            </div>
            <p className="w-full flex items-center justify-center text-xs text-gray-400">
                {message.update_time.substring(11, 16)}
            </p>
        </>)
}