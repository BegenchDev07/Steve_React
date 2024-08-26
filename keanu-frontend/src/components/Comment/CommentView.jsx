import React, {useState, useEffect} from "react";
import AvatarImage from "../AvatarImage";
import MDEditor from "../MDEditor";
import { s3Catcher } from "../../utils/apiChecker";
import { useAppDispatch } from "../../redux/hooks.js";
import { readAsText } from "../../utils/reader";
import {CommentPopUp} from "./index.js";

export default function CommentView ({avatar, user, createdAt, link}){
    const dispatch = useAppDispatch();
    const [content, setContent] = useState(null)
    const fetchCommentLexical = () => {
        s3Catcher(dispatch,'downloadProfile',link)
            .then((result)=>readAsText(result))
            .then((lexical)=>setContent(JSON.parse(lexical)))
    }

    useEffect(()=>{
        fetchCommentLexical();
    },[])

    return (
        <div className="w-full flex text-black">
            <AvatarImage avatar={avatar} width={10}></AvatarImage>
            <div className="ml-3 w-full border border-gray-400 rounded-xl">
                <div
                    className="w-full flex flex-row items-center relative border-b border-gray-400
                    pl-4 h-12"
                >
                    <a
                        className="no-underline font-semibold text-gray-600 author ml-1"
                        href=""
                    >
                        {user}
                    </a>
                    <div className="text-gray-600 ml-1">commented {createdAt}</div>
                    <CommentPopUp permission={"admin"}/>
                </div>
                <div className="w-full bg-slate-100 pl-2 border-b rounded-xl pt-4 pb-4">
                    {
                        (content != null)
                        &&
                        <MDEditor editorState={content ?? ''}
                                  editable={false}/>
                    }
                </div>
            </div>
        </div>
    );
};