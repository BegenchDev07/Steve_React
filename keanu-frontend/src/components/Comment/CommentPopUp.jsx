//"admin" can delete
import {useState} from "react";
import {AiOutlineHeart} from "react-icons/ai";
import {GoComment} from "react-icons/go";
import {MdDeleteOutline} from "react-icons/md";

export default function CommentPopUp({permission}) {
    const [reactionPopUpShow, setReactionPopUpShow] = useState(false);
    return (
        <>
            <div className="top-3 right-4 absolute">
                {reactionPopUpShow ? (
                    <div className="inline-flex px-2 border-2 rounded border-gray-500 bg-gray-300 mr-2">
                        <div className="w-20 border-r-2 border-gray-500">
                            <button className="inline-flex w-full pl-2">
                                <div className="self-center pr-1 ">
                                    <AiOutlineHeart className="text-[15px]"/>
                                </div>
                                Like
                            </button>
                        </div>
                        <div className="w-32 justify-self-center border-gray-500 ">
                            <button className="inline-flex w-full pl-5">
                                <div className="pt-1.5 pr-1">
                                    <GoComment className="text-[15px]"/>
                                </div>
                                Comment
                            </button>
                        </div>
                        {permission === "admin" ? (
                            <div className="w-24 justify-self-center border-gray-500 border-l-2">
                                <button className="inline-flex w-full pl-2">
                                    <div className="self-center pr-1">
                                        <MdDeleteOutline className="text-[18px]"/>
                                    </div>
                                    Delete
                                </button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                ) : (
                    <></>
                )}
                <button
                    className="relative  inline-flex px-1 font-bold text-gray-800 bg-gray-300 rounded"
                    onClick={() => {
                        setReactionPopUpShow(!reactionPopUpShow);
                    }}
                >
                    · · ·
                </button>
            </div>
        </>
    );
};