import MDEditor from "/src/components/MDEditor";
import {useNavigate, useParams} from "react-router-dom";
import {readAsDataURL, $readPath, getS3} from "/src/utils/reader.js";
import React, {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {apiCatcher} from "/src/utils/apiChecker.js";
import {useAppDispatch} from "../redux/hooks";
import {getComments} from "/src/services/API/comments";
import {getTagType} from "/src/assets/icons/tag";
import formatHumanReadableDate from "/src/components/Issue/utils/commentFormating"
import {getPillIcon} from "/src/assets/icons/tag";
import AvatarImage from "/src/components/AvatarImage";
import {getUserAvatar} from "../services/API/user";
import {HiDownload} from 'react-icons/hi';
import {getBackendURL} from "../utils/reader.js";
import keanuFetch from "../utils/keanuFetch";
import {isDraft} from "../utils/urlOperation.js";
import {getFileByUrl} from "../utils/dexie/operation.js";
import {genImagePreviewURL} from "../utils/fileOperation.js";
import { MENU_RESOURCE_FEEDBACK} from "../redux/constants/menuConstants";
import {useAppSelector} from "../redux/hooks.js";
import {DirectPay} from "../components/DirectPay/DirectPay.jsx";
import LikeSVG from '../assets/icons/floatingMenu/like.svg'
import LikeFillSVG from '../assets/icons/floatingMenu/likeFill.svg'
import SubsSVG from '../assets/icons/floatingMenu/subs.svg'
import SubsFill from '../assets/icons/floatingMenu/subsFill.svg'
import {CommentSection,CommentView} from "../components/Comment";
import { getResource } from "../services/API/resource";

const MODE = {login:1,post:2, product:4, paid:8};

export default function PostDetail({details}) {
    const [mode, setMode] = useState(0);
    const dispatch = useAppDispatch();
    const {username, uuid} = useParams();
    const isADraft = isDraft(uuid);
    const [avatarLink, setAvatarLink] = useState(String)
    const [resourceExpand, setResourceExpand] = useState(false);
    const [TopBannerLink, setTopBannerLink] = useState("");
    // const [checkoutExpand, setCheckoutExpand] = useState(false);
    const [comments, setComments] = useState(null);
    const [settings, setSettings] = useState(null);    
    const [resource, setResource] = useState([]);
    const [resourceFlag, setResourceFlag] = useState(false);    
    const [tagFlag, setTagFlag] = useState(false);
    const baseURL = getBackendURL();
    const s3 = getS3();
    const fetch = keanuFetch();
    const [feedbackData, setFeedbackData] = useState(null);

    const [authInteraction, setAuthInteraction] = useState(false);
    const [likeStat, setLikeStat] = useState(null);
    const [collectStat, setCollectStat] = useState(null);
    const [subscribeStat, setSubscribeStat] = useState(null);    
    const [productData, setProductData] = useState(null);    
    const [priceData, setPriceData] = useState(null);
    const navigator = useNavigate()

    const {isLoggedIn} = useAppSelector((state) => state.auth);

    const checkPaid = uuid=> fetch.get(new URL(`/api/product/pay/${uuid}`,baseURL));
    useEffect(() => {
        if(isLoggedIn)
            setMode(prev=> prev|MODE.login);
    }, []);

    const _getComments = (uuid) => apiCatcher(dispatch, getComments, uuid).then((result) => {
                        if (result.length !== 0)         setComments(result)});

    const fetchImage = (imageLink) => {
        return s3
            .downloadProfile(imageLink)
            .then((blob) => readAsDataURL(blob))
            .then((img) => {
                return img;
            });
    };


    const fetchData = async () => {                
        const {content, type} = details;                        
        const dbData = await apiCatcher(dispatch,getResource,uuid,type)
        dbData['content'] = content;
        // const tag = dbData.resource_tag.map(({tag})=>tag.name); 
        // if (!tag.includes(type))
        //     tag.push(type);
        debugger;
        if(type !== 'post'){
            setPriceData({currency:tempSettings.currency, price:tempSettings.price})                    
        }
        // debugger;
        setSettings(dbData);
        
        //fetchComments(uuid);

        if (isADraft) {
            // try to get file from indexeddb
            const TopBannerUrl = dbData?.topbanner?.url;
            if (TopBannerUrl) {
                const file = await getFileByUrl(TopBannerUrl);
                setTopBannerLink(genImagePreviewURL(file));
            }
            // if (details?.resource?.length > 0) {
            //     setResource(tempSettings.resource);
            //     setResourceFlag(true);
            // }
        } else {
            // debugger;
            // we force every post should have a topBanner image when upload, so we can safely assume the image is always there
            fetchImage(dbData.topbanner?.url).then((link) => {
                setTopBannerLink(link)
            });            
        }    

        if (details?.tags?.length > 0)
            setTagFlag(true);
    };

    const getFeedbackHelper = () => {
        return fetch.get(new URL(`/api/resource/feedback/${uuid}`, baseURL))
    }

    const getFeedbackData = () => {
        apiCatcher(dispatch, getFeedbackHelper)
            .then((result) => {
                setFeedbackData(result);

                dispatch({
                    type: MENU_RESOURCE_FEEDBACK,
                    payload: { feedback: result.status},
                });
                setLikeStat(result.like);
                setCollectStat(result.collect);
                setSubscribeStat(result.subscribe);
                if ('status' in result)
                    setAuthInteraction(true);
            })
    }

    const fetchAuthors = async () => {
        setAvatarLink(await getUserAvatar(username));
    };

    const _postFeedback = (type = 'like', username, uuid, value) => {
        return fetch.post(new URL('api/resource/feedback', baseURL), {
            type,
            uuid,
            username,
            value
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchAuthors();
        if (!isADraft) {
            _getComments(uuid);
            getFeedbackData();
        }
    }, []);

    const renderContent = () => {
        return (
            <div className="w-full flex py-4 items-center">
                <div className="w-full">
                        <span className="break-all whitespace-normal p-2 ">
                            {
                                (settings != null)
                                &&
                                <MDEditor editorState={(settings.content) ?? ''} clear={false}
                                          editable={false}/>
                            }
                        </span>
                </div>
            </div>
        )
    }


    


    const renderTags = () => {
        if (tagFlag === true){
            // debugger;
            return (
                <div className="w-3/4 flex gap-3 items-center justify-start py-2">
                    {(settings.resource_tag.length !== 0) &&
                        <div className="flex flex-col w-full items-start justify-start gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                {settings.resource_tag.map((ele, ind) => {
                                    return (
                                        <div className="w-auto flex" key={`tag-${ind}`}>
                                            {getTagType(ele.tag.name)}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>}
                </div>
            )
        }
    }

    const renderComments = () => {
        return (
            <div className="flex flex-col w-full rounded items-center px-5">
                <div className="pt-4"> Comments</div>
                {
                    (comments != null)
                    &&
                    comments.map((comment, index) => {
                        return (
                            <div className="w-full py-4" key={index}>
                                <CommentView
                                    key={comment.id}
                                    avatar={null}
                                    user={comment.user.username}
                                    createdAt={formatHumanReadableDate(comment.create_time)}
                                    link={comment.data_link}
                                />
                            </div>
                        );
                    })}
            </div>
        )
    }

    const renderInteraction = () => {
        return (
            <div className="w-full flex flex-col gap-3 items-center">                
                <div className="flex items-center gap-3 w-full">
                    <div className='flex gap-1 items-center justify-center'>
                        {
                            (feedbackData?.status?.like)
                            ?
                            <img src={LikeFillSVG} alt="" />
                            :
                            <img src={LikeSVG} alt="" />
                        }
                        {
                            (likeStat != null)
                            &&
                            <p className='px-0.5'>{likeStat}</p>                            

                        }
                    </div>
                    <div className='flex gap-1 items-center justify-center'>
                        {
                            (feedbackData?.status?.subscribe)
                            ?
                            <img src={SubsFill} alt="" />
                            :
                            <img src={SubsSVG} alt="" />
                        }
                        {
                            (subscribeStat != null)
                            &&                            
                            <p className='px-0.5'>{subscribeStat}</p>                            
                        }
                    </div>
                </div>                
            </div>
        )
    }
    
    const renderResourceHeader = () => {        
            return (
            <>
            <div className="flex flex-col gap-2 justify-center w-full p-8">
                    <div className="w-full flex gap-4">
                        <div className="w-2/4 flex items-center justify-center">
                            <div className="w-full flex flex-col gap-3 pl-4">
                                <div className="flex w-auto items-center gap-2">
                                    <AvatarImage avatar={null} width={6}/>
                                    <h3 className="font-thin text-2xl">{username}</h3>
                                </div>
                                <div className="flex items-start w-auto">
                                    <h1 className="text-start font-bold text-5xl overflow-none truncate">
                                        {settings.title}
                                    </h1>
                                </div>
                                { !isADraft && renderInteraction()}
                                <div className="w-full flex items-center justify-start">
                                    {settings.description}
                                </div>
                                <div className="w-full flex flex-wrap">
                                    {renderTags()}                        
                                </div>
                            </div>
                        </div>
                        <div className="w-3/4 flex items-center justify-center">
                            <img className="w-3/4 h-full object-fit rounded-lg" src={TopBannerLink} alt="TopBanner"></img>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const renderBody = () => {
        return (
            <div className="w-full h-screen flex flex-col gap-10">
                {renderResourceHeader()}                   
                <div className="w-full flex px-8 gap-4">
                    {renderContent()}                    
                </div>
                <div className="flex w-full px-4">
                    {
                        (isLoggedIn)
                        &&
                        (!isADraft) &&
                        CommentSection(dispatch,uuid,username)
                        //extract to a separate file()
                    }
                </div>
                {!isADraft && renderComments()}
            </div>
        )
    }


    return (
    <div className="container mx-auto">        

        {
        (settings != null) 
        &&
            renderBody()
        }
    </div>);
};