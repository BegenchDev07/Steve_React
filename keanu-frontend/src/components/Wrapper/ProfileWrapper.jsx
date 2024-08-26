import {Link, useNavigate} from "react-router-dom";
import React, {useContext, useEffect} from "react";
import {MasonryContext} from "../Masonry/index.js";

import DeleteSVG from '../../assets/icons/common/delete.svg';
import EditSVG from '../../assets/icons/common/edit.svg';
import {genUUID} from "../../utils/reader.js";
import {clearDraft} from "../../utils/urlOperation.js";

export default function ProfileWrapper({children, ele, onDelete}) {
    const navigator = useNavigate();
    const {height, title, uuid, username, feedback = null, type = null, name = null} = ele;
    const {auth} = useContext(MasonryContext);
    // debugger;

    const handleElementHover = (evt) => {
        if (evt.currentTarget.childNodes[0].classList.contains('hidden')) {
            evt.currentTarget.childNodes[0].classList.replace('hidden', 'visible')
        } else {
            evt.currentTarget.childNodes[0].classList.replace('visible', 'hidden')
        }
    }

    const deleteFunc = (e) => {
        e.stopPropagation()
        onDelete(uuid)
    }

    const editFunc = (e) => {
        e.stopPropagation()
        if (type !== '') {
            navigator(`/${type}/${clearDraft(uuid)}`)
        } else if (type === null)
            return true
    }

    useEffect(() => {
        if (name != null && name.length !== 0) {
            debugger;
        }
    }, [])

    return (
        <>
            <div className='w-full flex flex-col px-3 py-3 gap-3 bg-gray-200 rounded-lg' id={uuid}>

                {
                    (auth)
                        ?
                        <div
                            className="relative w-auto h-auto z-0"
                            onMouseEnter={handleElementHover}
                            onMouseLeave={handleElementHover}
                            onClick={() => {
                                navigator(`/@${username}/${uuid}`)
                            }}
                            id={genUUID()}
                        >
                            {/*<div*/}
                            {/*    className="absolute top-20 left-0 w-24 h-8 bg-red-400 text-white flex items-center justify-center transform -rotate-45 origin-top-left z-10">*/}
                            {/*    {type}*/}
                            {/*</div>*/}
                            <div
                                className="hidden absolute rounded-lg py-4 w-1/2 h-full bg-black/40 backdrop-opacity-20 flex flex-col items-center justify-center gap-3">
                                <button
                                    onClick={deleteFunc}
                                    className="text-xl font-semibold px-2 py-1 bg-white rounded-lg flex gap-3 items-center border-2 border-black">
                                    Delete
                                    <img src={DeleteSVG} alt="delete"/>
                                </button>
                                <button
                                    onClick={editFunc}
                                    className="text-xl font-semibold px-2 py-1 bg-white rounded-lg flex gap-3 items-center border-2 border-black">
                                    Edit
                                    <img src={EditSVG} alt="edit"/>
                                </button>
                            </div>
                            {children}
                        </div>

                        :
                        <div
                            className="relative w-auto h-auto"
                            onClick={() => {
                                navigator(`/@${username}/${uuid}`)
                            }}
                            id={genUUID()}
                        >
                            {children}
                        </div>
                }

                <div className="py-2 px-2 bg-gray-100/80 rounded-lg flex gap-3 font-bold hover:cursor-pointer">
                    <div className="w-2/3 truncate overflow-hidden">
                        <button onClick={() => navigator(`/@${username}/${resource?.uuid}`)}>
                            <h3 className="flex items-center">
                                {title}
                                {/* {feedback?JSON.stringify(feedback):''} */}
                            </h3>
                        </button>
                    </div>
                    <div className="w-1/3 flex items-center justify-center">
                        <div className="w-full flex flex-col gap-3 items-center justify-center">
                            {
                                (feedback != null)
                                &&
                                <div className="flex items-center justify-end gap-3 w-full">
                                    <div className='flex gap-1 items-center justify-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" aria-labelledby="Like" width="16"
                                             height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                             className="lucide lucide-heart">
                                            <path
                                                d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                        </svg>
                                    </div>
                                    <p className='px-0.5'>{feedback.like}</p>
                                    <div className='flex gap-1 items-center justify-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round"
                                             className="lucide lucide-share-2">
                                            <circle cx="18" cy="5" r="3"/>
                                            <circle cx="6" cy="12" r="3"/>
                                            <circle cx="18" cy="19" r="3"/>
                                            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
                                            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                                        </svg>
                                    </div>
                                    <p className='px-0.5'>{feedback.subscribe}</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}