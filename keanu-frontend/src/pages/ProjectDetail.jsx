import MDEditor from "/src/components/MDEditor";
import {useParams} from "react-router-dom";
import {readAsDataURL, $readPath, getS3, fetchIndexJson} from "/src/utils/reader.js";
import React, {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {top250, fontFindHelper} from "/src/utils/font";
import {apiCatcher} from "/src/utils/apiChecker.js";
import {useAppDispatch} from "../redux/hooks";
import {getComments,postComments} from "/src/services/API/comments";
import {getTagType} from "/src/assets/icons/tag";
import {CommentView} from "../components/Comment"
import formatHumanReadableDate from "/src/components/Issue/utils/commentFormating"
import {getPillIcon} from "/src/assets/icons/tag";
import AvatarImage from "/src/components/AvatarImage";
import {getUserAvatar} from "../services/API/user";
import {HiDownload} from 'react-icons/hi';
import {load, save,del} from "/src/utils/storageOperation.js";
import {genUUID, getBackendURL} from "../utils/reader.js";
import keanuFetch from "../utils/keanuFetch";
import {isDraft} from "../utils/urlOperation.js";
import {getFileByUrl} from "../utils/dexie/operation.js";
import {genImagePreviewURL} from "../utils/fileOperation.js";
import { MENU_RESOURCE_FEEDBACK} from "../redux/constants/menuConstants";
import {useAppSelector} from "../redux/hooks.js";
import {DirectPay} from "../components/DirectPay/DirectPay.jsx";
import {s3Catcher} from "../utils/apiChecker.js";

const MODE = {login:1,post:2, product:4, paid:8};

export default function ProjectDetail({details}) {
    const [mode, setMode] = useState(0);
    const dispatch = useAppDispatch();
    const {username, uuid} = useParams();
    const isADraft = isDraft(uuid);
    const [avatarLink, setAvatarLink] = useState(String)
    const [resourceExpand, setResourceExpand] = useState(false);
    const [TopBannerLink, setTopBannerLink] = useState("");
    const [comments, setComments] = useState(null);
    const [settings, setSettings] = useState(null);
    const [contentReadyFont, setContentReadyFont] = useState("");
    const [titleReadyFont, setTitleReadyFont] = useState("");
    const [resource, setResource] = useState([]);
    const [resourceFlag, setResourceFlag] = useState(false);
    const [typeFlag, setTypeFlag] = useState(false);
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
    const {isLoggedIn} = useAppSelector((state) => state.auth);

    const checkPaid = uuid=> fetch.get(new URL(`/api/product/pay/${uuid}`,baseURL));
    useEffect(() => {
        if(isLoggedIn)
            setMode(prev=> prev|MODE.login);
    }, []);

    const _getComments = (uuid) => apiCatcher(dispatch, getComments, uuid).then((result) => {
                        if (result.length != 0)         setComments(result)}),
          _postComments = (comment_uuid, resource_uuid,link)=>apiCatcher(dispatch,postComments,comment_uuid, resource_uuid,link);

    const fetchImage = (imageLink) => {
        return s3
            .downloadProfile(imageLink)
            .then((blob) => readAsDataURL(blob))
            .then((img) => {
                return img;
            });
    };

    const fetchData = async () => {
        let tempSettings = details;        
        const loadedTitle = (tempSettings.style?.titleFont) ? await top250[fontFindHelper(tempSettings.style.titleFont)].load() : await top250[0].load() //each font has load function inside activating which we initiate loading process
        const loadedContent = (tempSettings.style?.contentFont) ? await top250[fontFindHelper(tempSettings.style.contentFont)].load() : await top250[0].load()
        const titleLoaded = loadedTitle?.loadFont()
        const contentLoaded = loadedContent?.loadFont()
        // setTitleReadyFont(titleLoaded.fontFamily)
        // setContentReadyFont(contentLoaded.fontFamily)        
        setSettings(tempSettings);
        
        //fetchComments(uuid);

        if (isADraft) {
            // try to get file from indexeddb
            const TopBannerUrl = tempSettings?.topbanner?.[0].url;
            if (TopBannerUrl) {
                const file = await getFileByUrl(TopBannerUrl);
                setTopBannerLink(genImagePreviewURL(file));
            }
            if (tempSettings?.resource?.length > 0) {
                setResource(tempSettings.resource);
                setResourceFlag(true);
            }
        } else {
            // we force every post should have a topBanner image when upload, so we can safely assume the image is always there
            fetchImage(tempSettings.media.topbanner?.[0].url).then((link) => {
                setTopBannerLink(link)
            });
            if (tempSettings.media.resource.length > 0) {
                setResource(tempSettings.media.resource);
                setResourceFlag(true);
            }
        }
        if (tempSettings?.resourceTypes?.length > 0)
            setTypeFlag(true);

        if (tempSettings?.tags?.length > 0)
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

    const handleDownload = async (result) => {
        let downloadUrl;
        if (isADraft) {
            downloadUrl = URL.createObjectURL(await getFileByUrl(result));
        } else {
            downloadUrl = await downloadProfile(s3, result);
        }
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = result.split('/').at(-1);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const _postFeedback = (type = 'like', username, uuid, value) => {
        return fetch.post(new URL('api/resource/feedback', baseURL), {
            type,
            uuid,
            username,
            value
        });
    }

    const likeHandler = (event) => {
        if (authInteraction) {
            setLikeStat(!likeStat);
            return apiCatcher(dispatch, _postFeedback, 'like', username, uuid, (feedbackData.status.like ? -1 : 1));
        }
    }

    const collectHandler = (event) => {
        if (authInteraction) {
            setCollectStat(!collectStat);
            return apiCatcher(dispatch, _postFeedback, 'favorite', username, uuid, (feedbackData.status.collect ? -1 : 1));
        }
    }

    const getFileName = (data) => {
        const {file} = $readPath(data)
        return file;
    }

    useEffect(() => {
        fetchData();

    }, [titleReadyFont, contentReadyFont]);

    useEffect(() => {
        fetchAuthors();
        if (!isADraft) {
            _getComments(uuid);
            getFeedbackData();
        }
    }, []);

    const renderContent = () => {
        return (
            <div className="w-2/3 flex py-4 items-center">
                <div className="w-full">
                        <span className="break-all whitespace-normal p-2 " style={{fontFamily: `${contentReadyFont}`}}>
                            {
                                // settings
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

    const onPayComplete = useCallback(_=> setMode(prev=>prev|MODE.paid));


    const visitMode = () => {
        return (
            <div className="w-full flex flex-col items-start justify-center">
            {(resourceFlag === true) &&
                <div className="w-3/4 flex flex-col gap-3 text-center">
                <div className="flex gap-3">
                    <button
                        onClick={evt=>{
                            navigator('/login')
                        }}
                        className="w-auto px-3 border border-gray-400 rounded flex gap-3 items-center items-center justify-center px-1 py-1">
                        Login to Purchase
                    </button>
                    <button onClick={()=>{setResourceExpand(!resourceExpand)}} className="w-auto text-white bg-blue-600 border border-white rounded flex gap-3 items-center items-center justify-center px-1 py-1 ">                        
                        {
                            (resourceExpand)
                            ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>                            
                            : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down "><path d="m6 9 6 6 6-6"/></svg>
                        }
                    </button>
                </div>
                {
                (resourceExpand)
                &&
                <div className="flex flex-col w-full items-center justify-center border-y-2 border-gray-400 bg-gray-200 border-dashed py-3">
                     {
                         resource?.map(({url}, index) => {
                             return (
                                 <div className="w-full flex items-center" key={index}>
                                     <p className="w-full text-black overflow-hidden truncate cursor-pointer"
                                        onClick={() => navigator('/login')}
                                        >
                                         {getFileName(url)}
                                     </p>
                                     {/* <HiDownload className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                                                 onClick={() => handleDownload(url)}/> */}
                                 </div>
                             );
                         })
                     }
                </div>
                }
            </div>
                }
            </div>
        )
    }

    const buyMode = () => {
        // debugger;
        return(
            <div className="w-full flex flex-col items-start justify-center">
            {(resourceFlag === true) &&
                <div className="w-3/4 flex flex-col gap-3 text-center">
                <div className="flex gap-3">                    
                        {
                        (productData) ?
                            <button
                            onClick={evt=> directPayRef.current.initPay()}
                            className="w-auto px-3 border border-gray-400 rounded flex gap-3 items-center items-center justify-center px-1 py-1">
                            <div className="flex gap-1 items-center">
                                <p>{(productData.unit_amount/100).toString()}</p>
                                <p className="uppercase">{productData.currency}</p>
                            </div>
                            </button>
                        :                         
                        <button
                        // onClick={evt=> directPayRef.current.pay(uuid)}
                        className="w-auto px-3 border border-gray-300 text-gray-500 rounded flex gap-3 items-center items-center justify-center px-1 py-1 cursor-default">
                        <div className="flex gap-3 items-center">                            
                            Pending...
                        </div>
                        </button>
                        }                    
                    <button 
                    className="w-auto text-white bg-blue-600 border border-white rounded flex gap-3 items-center items-center justify-center px-1 py-1 "
                    onClick={()=>{setResourceExpand(!resourceExpand)}} >                        
                        {
                            (resourceExpand)
                            ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>                            
                            : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down "><path d="m6 9 6 6 6-6"/></svg>
                        }
                        
                    </button>
                </div>
                {
                (resourceExpand)
                &&
                <div className="flex flex-col w-full items-center justify-center border-y-2 border-gray-400 bg-gray-200 border-dashed py-3">
                     {
                         resource?.map(({url}, index) => {
                             return (
                                 <div className="w-full flex items-center" key={index}>
                                     <p className="w-full text-black overflow-hidden truncate cursor-pointer"
                                        onClick={() => directPayRef.current.initPay()}
                                        >
                                         {getFileName(url)}
                                     </p>
                                     {/* <HiDownload className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                                                 onClick={() => handleDownload(url)}/> */}
                                 </div>
                             );
                         })
                     }
                </div>
                }
            </div>
                }
            </div>
        )
    }

    const paidMode = () => {        
        return(
            <div className="w-3/4 flex flex-col gap-3 text-center">
            <div className="flex gap-3">
                <button onClick={()=>{setResourceExpand(!resourceExpand)}} className="w-auto px-3 border border-gray-400 rounded flex gap-3 items-center items-center justify-center px-1 py-1">
                    Download
                </button>
                <button onClick={()=>{setResourceExpand(!resourceExpand)}} className="w-auto text-white bg-blue-600 border border-white rounded flex gap-3 items-center items-center justify-center px-1 py-1 ">                                                            
                    {
                        (resourceExpand)
                        ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>                            
                        : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down "><path d="m6 9 6 6 6-6"/></svg>
                    }
                </button>
            </div>
            {
            (resourceExpand)
            &&
            <div className="flex flex-col w-full items-start justify-center border-y-2 border-gray-400 bg-gray-200 border-dashed">
                <p className="w-full underline text-center">What do i get ?</p>
                 {
                     resource?.map(({url}, index) => {
                         return (
                             <div className="w-full flex items-center py-3" key={index}>
                                 <p className="w-full text-black overflow-hidden truncate cursor-pointer"
                                    onClick={() => handleDownload(url)}>
                                     {getFileName(url)}
                                 </p>
                                 <HiDownload className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                                             onClick={() => handleDownload(url)}/>
                             </div>
                         );
                     })
                 }
            </div>
            }
            </div>
        )
    }

    const downloadAll = (urlArr) => {
        return Promise.all((urlArr).map((url)=>{
            return handleDownload(url)
        }))
    }

    const renderResource = () => {
        // debugger;

        if(!(mode&MODE.login)){
            return visitMode();
        }else{
            if(mode&MODE.paid){                
                return paidMode();
            }else{                   
                return buyMode();
            }
        }
        
    }

    const renderResourceTypes = () => {
        if (typeFlag === true)
            return (
                <div className="w-full flex flex-col items-center justify-center gap-3">
                    <div className="w-full flex justify-start gap-3">
                        {(settings.resourceTypes != null) && settings.resourceTypes.map((types,index) => {
                            return (
                            <Fragment key={index}>
                                {getPillIcon(types)}
                            </Fragment>
                            )
                        })}
                    </div>
                </div>
            )
    }

    const renderTags = () => {
        if (tagFlag === true)
            return (
                <div className="w-3/4 flex gap-3 items-center justify-start py-2">
                    {(settings.tags.length !== 0) &&
                        <div className="flex flex-col w-full items-start justify-start gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                {settings.tags.map((ele, ind) => {
                                    return (
                                        <div className="w-auto flex" key={`tag-${ind}`}>
                                            {getTagType(ele)}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>}
                </div>
            )
    }
    const COMMENT_ID = `comment`;
    const loadValue = key => load(COMMENT_ID, key);
    const saveValue = (key, value) => save(COMMENT_ID, key, value);
    const deleteValue =  key=>del(COMMENT_ID, key);

    const onClickSubmitComment = evt=>{
        const commentLexical = loadValue(uuid);
        if(!commentLexical) return;
        debugger;
        const commentUUID = genUUID();
        const link = `${username}/.profile/${uuid}/comments/${commentUUID}.lexical`;
        s3Catcher(dispatch,'uploadProfile', link, JSON.stringify(commentLexical))
            .then(_=>_postComments(commentUUID, uuid, link))
            .then(_=> deleteValue(uuid));
    }
    const renderCommentSection = () => {
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
                        className="px-1 py-1 bg-blue-600 text-white py-2 rounded-md">
                        Submit
                    </button>
                </div>
            </div>
        )
    }

    const renderComments = () => {
        return (
            <div className="flex flex-col w-full rounded items-center px-5">
                <div className="pt-4" style={{fontSize: "2rem"}}> Comments</div>
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
                                    link={comment.link}
                                />
                            </div>
                        );
                    })}
            </div>
        )
    }

    const renderInteraction = () => {
        return (
            <div className="w-full flex flex-col gap-3 items-center text-white">                
                <div className="flex items-center gap-3 w-full">
                    <div className='flex gap-1 items-center justify-center'>
                        {
                            (feedbackData)
                            &&
                            (feedbackData.status.like)
                            ?
                            <svg xmlns="http://www.w3.org/2000/svg" aria-labelledby="Like" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>                        
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" aria-labelledby="Like" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>                        
                        }
                        {
                            (likeStat != null)
                            &&
                            <p className='px-0.5'>{likeStat}</p>                            

                        }
                    </div>
                    {/* <div className='flex gap-1 items-center justify-center'>
                        {
                            (feedbackData)
                            &&
                            (feedbackData.status.collect)
                            ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>                        
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>                        
                        }
                        {
                            (collectStat != null)
                            &&      
                            <p className='px-0.5'>{collectStat}</p>
                            
                        }
                    </div> */}
                    <div className='flex gap-1 items-center justify-center'>
                        {
                            (feedbackData)
                            &&
                            (feedbackData.status.subscribe)
                            ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
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
                <div className="w-full flex px-10 py-5 gap-20">                    
                    <div className="w-2/3 h-full flex flex-col gap-5">
                        <div className="w-full h-44 relative">
                            <div className="w-full h-full">
                                <img className="w-full h-full object-fit rounded-lg" src={TopBannerLink} alt="TopBanner"/>
                            </div>
                            <div className="w-full h-full items-start justify-end flex flex-col absolute top-0 px-4 py-3 bg-black/30 backdrop-opacity-20 rounded-lg gap-1">
                                <h1 className="text-start text-white font-bold text-5xl overflow-none truncate">
                                    {settings.name}
                                </h1>
                                { !isADraft && renderInteraction()}
                            </div>                            
                        </div>
                        <div className="w-full h-full flex flex-col items-start justify-center">
                                <h3 className="font-bold text-2xl text-dark">Demo:</h3>
                        </div>
                    </div>                    
                    <div className="w-1/3 h-full flex flex-col gap-10 px-4 items-start justify-start">   
                        <div className="w-full flex gap-3 text-black">                            
                            <div className="w-full">
                            <h3 className="font-semibold text-2xl">Description:</h3>
                                <p>{
                                settings.description                    
                                }</p>                    
                            </div>
                        </div>  
                        <hr className="w-full" />                      
                        <div className="w-full flex flex-col gap-3 text-black">              
                            <h3 className="font-semibold text-2xl">Tags:</h3>              
                            {renderTags()}
                        </div>
                        <hr className="w-full" />                      
                        <div className="w-full flex flex-col gap-3 text-black">              
                            <h3 className="font-semibold text-2xl">Contributors:</h3>              
                            <div className="w-full flex gap-3">
                                <AvatarImage avatar={null} width={10}/>
                                <AvatarImage avatar={null} width={10}/>
                                <AvatarImage avatar={null} width={10}/>
                                <AvatarImage avatar={null} width={10}/>                            
                            </div>
                        </div>
                        <hr className="w-full" />                      
                        {/* <div className="flex w-auto items-center gap-3">
                            <h3 className="font-semibold text-lg">Contributors:</h3>
                            <AvatarImage avatar={null} width={10}/>
                            <AvatarImage avatar={null} width={10}/>
                            <AvatarImage avatar={null} width={10}/>
                            <AvatarImage avatar={null} width={10}/>                            
                        </div> */}                        
                    </div>
                </div>                
                </>
            )
        
    }



    const directPayRef = useRef(null);

    useEffect(() => {
        if(resourceFlag === false) return;

        if(directPayRef.current)
            directPayRef.current.query(uuid) //"12345678" ==> "priceID"
                .then(({currency, unit_amount})=> setProductData({currency: currency, unit_amount: unit_amount}));

        apiCatcher(dispatch, checkPaid, uuid)
            .then(result=>{
                if(result){                    
                    setMode(prev=> prev|MODE.paid);
                    setResourceExpand(true);
                }
            });

    }, [directPayRef.current,resourceFlag]);

    return (<>


        <DirectPay ref={directPayRef} onPayComplete = {onPayComplete}/>

        {(settings != null) &&
            <div
                className="w-full h-screen bg-white"
                // id="backgroundConatainer"
                // style={{
                //     backgroundColor: `${settings.style?.bgColor ?? 'white'}`
                // }}
            >
                {renderResourceHeader()}
                {/* <div className="flex flex-col gap-2 justify-center mx-auto w-full px-8"
                     style={{color: `${settings.style?.contentColor ?? 'black'}`}}>
                    <div className="w-full flex gap-4">
                        <div className="w-2/4 flex items-center justify-center">
                            <div className="w-full flex flex-col gap-3 pl-4">
                                <div className="flex w-auto items-center gap-2">
                                    <AvatarImage avatar={null} width={6}/>
                                    <h3 className="font-thin text-2xl">{username}</h3>
                                </div>
                                <div className="flex items-start w-auto">
                                    <h1 className="text-start font-bold text-5xl overflow-none truncate" style={{
                                        color: `${settings.style?.titleColor ?? 'black'}`,
                                        fontFamily: `${titleReadyFont}`
                                    }}>{settings.title}</h1>
                                </div>
                                { !isADraft && renderInteraction()}

                            </div>
                        </div>
                        <div className="w-3/4 flex items-center justify-center">
                            <img className="w-full h-full rounded-lg" src={TopBannerLink} alt="TopBanner"></img>
                        </div>
                    </div>
                </div> */}

                <div className="w-full flex px-8 gap-4">
                    {renderContent()}                    
                </div>
                <div className="flex w-full px-4">
                {
                    (isLoggedIn)
                    &&
                    (!isADraft) && renderCommentSection()
                }
                </div>
                {!isADraft && renderComments()}
            </div>}
    </>);
};