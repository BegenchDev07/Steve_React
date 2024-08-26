import {forwardRef, useCallback, useEffect, useRef, useState} from "react";
import {Contacts} from "../components/Contacts";
import {Chat} from "../components/Chat";
import {useAppSelector} from "../redux/hooks";
import {PRIVATE_MESSAGE} from "../redux/constants/notificationConstants.js";
import AISTATUS from "../../../share/AISTATUS.mjs";

function _Inbox(params, ref) {
    const [conversationPartnerUsername, setConversationPartnerUsername] = useState('');
    const [conversationPartnerId, setConversationPartnerId] = useState('');

    const contactRef = useRef(null);
    const chatRef = useRef(null);

    const openContact = useCallback((id, username) => {
        setConversationPartnerId(id);
        setConversationPartnerUsername(username);
        if (chatRef.current && chatRef.current.refresh) {
            chatRef.current.refresh({id, username});//pull message
        }
    }, []);

    // push message from sse
    const notification = useAppSelector((state) => state.notification);

    useEffect(() => {
        if (!notification) return;

        const {type, content, sender_id} = notification;

        if (type !== PRIVATE_MESSAGE) return;

        // todo: currently,we just update the chat when the sender is the current conversation partner
        if (conversationPartnerId === sender_id) {
            const currentTime = new Date().toISOString(); // this is a tradeoff
            console.log(notification)
            let coming_message =
                {
                    sender: {username: conversationPartnerUsername, id: sender_id},
                    type: PRIVATE_MESSAGE,
                    content: content,
                    create_time: currentTime,
                    update_time: currentTime
                };
            if (notification?.content?.status === AISTATUS.uploadEnd) {
                coming_message.type = "SD_client_infer";
                coming_message.content = {...notification.content, images: notification?.content?.images ?? []};
            }
            //console.log(coming_message);
            chatRef.current.update(coming_message);
        }
    }, [notification]);

    useEffect(() => {
        if (contactRef.current && contactRef.current.refresh) {
            contactRef.current.refresh();
        }
    }, [contactRef.current]);

    return (
        <div className="w-full h-full flex border-gray-400">
            <div className="w-1/3 h-screen gap-5 flex flex-col px-3 py-3 overflow-y-auto">
                <Contacts ref={contactRef} openContact={openContact}/>
            </div>
            <div className="w-2/3 h-screen overflow-y-auto pt-3 border-x-2 border-gray-400 px-3">
                <Chat ref={chatRef}/>
            </div>
            <div className="w-1/3 h-screen py-3">

            </div>
        </div>
    );
}

export const Inbox = forwardRef(_Inbox);