import {useState} from "react";
import {useLocation} from "react-router-dom";
import {useAppDispatch} from "../redux/hooks.js";
import {postMsg} from "../services/API/notifications";
import {apiCatcher} from "../utils/apiChecker.js";

const SendMsgLayout = ({menu, onRedirect}) => {
    const [message, setMessage] = useState(""); // State to hold the message input
    const initialMessage = {type: "private_msg", content: {text: ""}};
    const [messageObj, setMessageObj] = useState(initialMessage);
    const dispatch = useAppDispatch();
    const location = useLocation();

    const receiverUsername = location.pathname.substring(location.pathname.lastIndexOf("@") + 1);

    function handleTextChange(e) {
        setMessageObj({...messageObj, content: {text: e.target.value}});
    }

    const onClkSendMsg = () => {
        if (messageObj.content.text.trim()==="") {
            alert("Please enter a message."); // Basic validation for empty message
            return;
        }
        return apiCatcher(dispatch, postMsg, receiverUsername, messageObj)
            .then(result => {
                console.log(result); // Log the result or handle as needed
                setMessageObj(initialMessage);
                // if (onRedirect) {
                //   onRedirect(); // Optionally handle any redirection if needed
                // }
            });
    };

    return (
        <>
            <div
                className="w-full flex flex-row text-white h-auto bg-zinc-700 z-10 rounded-lg">
                <textarea
                    rows={5}
                    className="relative flex items-start justify-start w-full h-1/2 px-1 py-1 rounded"
                    id="#input"
                    value={messageObj.content.text}
                    onChange={handleTextChange}
                    placeholder="Type a message..."
                    style={{color: "black"}}
                />
                <button
                    className="text-white border border-gray-500 rounded-lg absolute right-4 bottom-20 px-2 py-1 w-auto h-auto bg-green-600"
                    id="#btn"
                    onClick={onClkSendMsg}
                >
                    Send
                </button>
            </div>
        </>
    );
};

export default SendMsgLayout;
