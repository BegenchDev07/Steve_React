import React, {forwardRef, Fragment, useImperativeHandle, useRef, useState,} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.js";
import {getMsgWithContact, postMsg} from "../../services/API/notifications";
import {apiCatcher} from "../../utils/apiChecker.js";
import SDMessage from "../Message/SDMessage.jsx";
import {Message} from "../Message/index.js";
import {
    PRIVATE_MESSAGE,
    SD_CLIENT_INFER_PROGRESS,
    SD_CLIENT_INFER_REQ
} from "../../redux/constants/notificationConstants.js";
import {useIntersectionObserver} from "../../utils/hooks.js";

const MODE = {start: 1, update: 2, input: 16, refreshHistory: 32, msg: 64}

function _Chat({}, ref) {
    const dispatch = useAppDispatch();

    const [messages, setMessages] = useState([]);

    const initialMessage = {type: PRIVATE_MESSAGE, content: {text: ""}};
    const [messageObj, setMessageObj] = useState(initialMessage);

    const contactRef = useRef(null);

    const messagesEndRef = useRef(null);

    const {user} = useAppSelector((state) => state.auth);
    const username = user.username;

    const mode = useRef(0);

    // todo: need to enable pagination
    const take = 10;
    const skipRef = useRef(0);

    const fetchMessages = (msgContact) => {
        console.log("try to fetch message", "skip", skipRef.current);
        return apiCatcher(dispatch, getMsgWithContact, msgContact.id, skipRef.current, take)
    };

    const mergeMessage = (incomingMessages, isHistory = false) => {
        console.log(incomingMessages);
        if (incomingMessages.length === 0) return;

        setMessages(prev => {
            const existingIds = new Set(prev.map(msg => msg.id));
            const filteredMessages = incomingMessages.filter(msg => !existingIds.has(msg.id));
            return isHistory
                ? [...filteredMessages, ...prev]
                : [...prev, ...filteredMessages];
        });
        return Promise.resolve();
    };

    function handleTextChange(e) {
        setMessageObj({...messageObj, content: {text: e.target.value}});
    }

    const handleDMSubmit = (event) => {
        event.preventDefault();
        if (messageObj.content.text.trim()) {
            // to make the user feel the message is sent
            const currentTime = new Date().toISOString();
            // todo: need a status
            const coming_message = {
                sender: {username: username},
                type: messageObj.type,
                content: messageObj.content,
                create_time: currentTime,
                update_time: currentTime,
            }
            // there should add a condition,only when the message's receiver is the system
            if (messageObj.type === SD_CLIENT_INFER_REQ) {
                const progress_message = {
                    sender: {username: "system", id: 100},
                    type: SD_CLIENT_INFER_PROGRESS,
                    content: {uuid: messageObj.content?.uuid},
                    create_time: currentTime,
                    update_time: currentTime
                }
                setMessages(prev => [...prev, coming_message, progress_message]);
            } else {
                setMessages(prev => [...prev, coming_message])
            }
            setMessageObj(initialMessage);

            const currentMessageObj = messageObj;
            scrollToBottom();

            // start loading
            apiCatcher(dispatch, postMsg, contactRef.current.username, currentMessageObj)
                .then(_ => {
                    // done
                })
                .catch(err => {
                    // recover
                    //setMessageObj(currentMessageObj);
                });
        }
    };

    // https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
    const itemsRef = useRef(null);

    function getMap() {
        if (!itemsRef.current) {
            // Initialize the Map on first usage.
            itemsRef.current = new Map();
        }
        return itemsRef.current;
    }

    function scrollToMessage(msgId) {
        const map = getMap();
        const node = map.get(msgId);
        node.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    const observerOption = {
        root: null,
        rootMargin: '0px',
        threshold: 1
    };

    const topRef = useIntersectionObserver(observerOption, () => {
        if (contactRef.current === null) {
            console.log("no contact,no need to refresh");
            return;
        }
        // if is in the middle of refreshing, then return
        if (mode.current & MODE.refreshHistory)
            return;
        console.log("need fresh");
        mode.current = MODE.refreshHistory | MODE.start;
        fetchMessages(contactRef.current)
            .then((comingMessage) => {
                mergeMessage(comingMessage, true)
                    .then(_ => {
                        console.log("refresh done");
                        mode.current = 0;
                        skipRef.current += comingMessage.length;
                    })
            })
            .catch(err => {
                console.log(err);
                mode.current = 0;
            })
    });

    useImperativeHandle(ref, () => ({
        refresh: contact => {
            setMessages([]);
            contactRef.current = contact;
            mode.current = MODE.refreshHistory | MODE.start;
            fetchMessages(contactRef.current)
                .then((comingMessage) => {
                    mergeMessage(comingMessage)
                        .then(_ => {
                            mode.current = 0;
                            // start from take
                            skipRef.current = take;
                            scrollToBottom();
                        })
                })
        },
        update: (coming_message) => {
            console.log(coming_message)
            setMessages(prev => [...prev, coming_message]);
        },
    }));

    function handleCancel() {
        setMessageObj(initialMessage);
    }

    const renderPendingMessage = () => {
        if (messageObj.content.text === "" || messageObj.type === "private_msg") {
            return null;
        }

        return (
            <div className="relative w-full border border-gray-300 rounded">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                    onClick={() => handleCancel()}
                >
                    ✖
                </button>

                {messageObj.type === "SD_client_infer_req" && <SDMessage message={messageObj} type={4}/>}
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col gap-3">

            <div className="w-full h-3/4 overflow-y-scroll overflow-x-hidden">
                <div ref={topRef}/>
                <div className="flex flex-col gap-6">
                    {messages.map((message, index) => (
                            <Fragment key={index}
                                      ref={(node) => {
                                          if (node) {
                                              itemsRef.current.set(message.id, node);
                                          } else {
                                              itemsRef.current.delete(message.id);
                                          }
                                      }}>
                                <Message username={username} message={message} setMessageObj={setMessageObj}/>
                            </Fragment>
                        )
                    )}
                    <div ref={messagesEndRef}/>
                </div>
            </div>

            <div className="w-full sticky bottom-0 bg-gray-100">
                {renderPendingMessage()}

                <form onSubmit={handleDMSubmit} className="w-full flex py-3">
                    
                <textarea
                    value={messageObj.content.text}
                    onChange={handleTextChange}
                    placeholder="Type your message here"
                    required
                    className="flex-1 h-12 px-4 border border-gray-300 rounded"
                />
                    <button
                        type="submit"
                        className="ml-2 px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
                    >
                        Send
                    </button>
                </form>
            </div>

        </div>
    );
}

export const Chat = forwardRef(_Chat);