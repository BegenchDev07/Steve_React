import React from "react";
import {del, load, save} from "../../utils/storageOperation";
import {genUUID} from "../../utils/reader";
import {apiCatcher, s3Catcher} from "../../utils/apiChecker";
import MDEditor from "../MDEditor";
import {postComments} from "../../services/API/comments/index";

export default function CommentSection(dispatch,uuid,username){
    const COMMENT_ID = `comment`;
    const loadValue = key => load(COMMENT_ID, key);
    const saveValue = (key, value) => save(COMMENT_ID, key, value);
    const deleteValue =  key=>del(COMMENT_ID, key);
    const _postComments = (comment_uuid, resource_uuid,link)=>apiCatcher(dispatch,postComments,comment_uuid, resource_uuid,link);

    const onClickSubmitComment = evt=>{
        const commentLexical = loadValue(uuid);
        if(!commentLexical) return;
        const commentUUID = genUUID();
        const link = `${username}/.profile/${uuid}/comments/${commentUUID}.lexical`;
        s3Catcher(dispatch,'uploadProfile', link, JSON.stringify(commentLexical))
            .then(_=>_postComments(commentUUID, uuid, link))
            .then(_=> deleteValue(uuid))
            .then(_ => window.location.reload());
    }

    return (
        <div className="w-full flex flex-col border  border-gray-400  rounded-lg">
            <div className="w-full flex">
                <MDEditor
                    editorState={ loadValue(uuid) ?? ''}
                    onSave={lexicalData => saveValue(uuid, JSON.parse(JSON.stringify(lexicalData)))}
                    editable={true}/>
            </div>
            <div className="w-full flex justify-end px-2 py-2">
                <button
                    onClick={onClickSubmitComment}
                    className="px-1 py-1 bg-blue-600 text-white rounded-md">
                    Submit
                </button>
            </div>
        </div>
    )
}