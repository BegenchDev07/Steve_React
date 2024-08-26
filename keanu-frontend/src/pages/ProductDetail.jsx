import MDEditor from "/src/components/MDEditor";
import {useParams} from "react-router-dom";
import {readAsDataURL, $readPath, getS3} from "/src/utils/reader.js";
import React, {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {apiCatcher} from "/src/utils/apiChecker.js";
import {useAppDispatch} from "../redux/hooks";
import {getComments, postComments} from "/src/services/API/comments";
import {getTagType} from "/src/assets/icons/tag";
import {CommentView,CommentSection} from "../components/Comment"
import formatHumanReadableDate from "/src/components/Issue/utils/commentFormating"
import {getPillIcon} from "/src/assets/icons/tag";
import AvatarImage from "/src/components/AvatarImage";
import {GoChevronDown} from "react-icons/go";
import {genUUID, getBackendURL, $debounce} from "../utils/reader.js";
import keanuFetch from "../utils/keanuFetch";
import {isDraft} from "../utils/urlOperation.js";
import {getFileByUrl} from "../utils/dexie/operation.js";
import {genImageLinkByFile} from "../utils/fileOperation.js";
import {MENU_RESOURCE_FEEDBACK} from "../redux/constants/menuConstants";
import {useAppSelector} from "../redux/hooks.js";
import {DirectPay} from "../components/DirectPay/DirectPay.jsx";
import LikeSVG from '../assets/icons/floatingMenu/like.svg'
import LikeFillSVG from '../assets/icons/floatingMenu/likeFill.svg'
import SubsSVG from '../assets/icons/floatingMenu/subs.svg'
import SubsFill from '../assets/icons/floatingMenu/subsFill.svg'
import { s3Catcher } from "../utils/apiChecker";
import GHLoading from "../components/GHLoading";


const baseURL = getBackendURL();
const s3 = getS3();
const fetch = keanuFetch();
const MODE = {login: 1, draft: 2, paid: 4};

export default function ProductDetail({details}) {
    const [mode, setMode] = useState(0);
    const dispatch = useAppDispatch();
    const {username, uuid} = useParams();
    const isADraft = isDraft(uuid);
    const [TopBannerLink, setTopBannerLink] = useState(null);
    const [topBannerList, setTopBannerList] = useState([])
    const [comments, setComments] = useState(null);
    const [feedbackData, setFeedbackData] = useState(null);
    const [title, setTitle] = useState(null);
    const [likeStat, setLikeStat] = useState(null);
    const [items, setItems] = useState([]);
    const [subscribeStat, setSubscribeStat] = useState(null);
    const [description, setDescription] = useState(null);
    const [donateAmount, setDonateAmount] = useState([]);
    const [physicalQty, setPhysicalQty] = useState([]);
    const [secondaryTitle, setSecondaryTitle] = useState(null);
    const [donateState, setDonatetState] = useState(false);
    const [currencies, setCurrencies] = useState({'usd': '$', 'hkd': '$HK'})
    const [price, setPrice] = useState(null);
    const [curItemDetail, setCurItemDetail] = useState(null);

    const directPayRef = useRef(null);

    const {isLoggedIn} = useAppSelector((state) => state.auth);

    const onPayComplete = useCallback(uuid => {
        setMode(prev => prev | MODE.paid);
        items.find(item => item.uuid === uuid).paid = true;
        setItems(items);
    });

    useEffect(()=>{},[donateState])

    useEffect(() => {
        // topbannerHelper();
        // fetchImage(details.media.topbanner?.url).then((link) => {
        //     setTopBannerLink(link)
        // });
        fetchProductItem();        
        if (isLoggedIn)
            setMode(prev => prev | MODE.login);
        if (isADraft)
            setMode(prev => prev | MODE.draft);

    }, []);

    const _getComments = (uuid) => apiCatcher(dispatch, getComments, uuid).then((result) => {
            if (result.length != 0) setComments(result)
        }),
        _postComments = (comment_uuid, resource_uuid, link) => apiCatcher(dispatch, postComments, comment_uuid, resource_uuid, link);

    const fetchImage = (imageLink) => {
        return s3
            .downloadProfile(imageLink)
            .then((blob) =>
                readAsDataURL(blob))
            .then((img) => {
                return img;
            });
    };

    const topbannerHelper = async (jobs) => {
        // debugger;
        if (isADraft) {
            // try to get file from indexeddb
            const TopBannerUrl = details?.topbanner?.[0].url;
            if (TopBannerUrl) {
                const file = await getFileByUrl(TopBannerUrl);
                genImageLinkByFile(file).then((link) => {
                    setTopBannerLink(link);
                });
            }
        } else {
            // we force every post should have a topBanner image when upload, so we can safely assume the image is always there
            Promise.all(jobs.map((ele)=>{
                return fetchImage(ele).then((link) => {
                    return {link:ele,data:link};                    
                });
            })).then((result)=>{
                setTopBannerList(result);
            })
        }
    }

    const fetchProductItem = async () => {

        setTitle(details.title)
        setDescription(details.description)
        
        
        // debugger;
        const digiItems = details.product_item.filter(item => item.type === 'digital');
        const phyItems = details.product_item.map((item) => {
            if (item.type === 'physical') {
                return {id: item.uuid, qty: 1}
            }
        })
        // const ins = phyItems.filter(item => item)
        // debugger;
        setPhysicalQty(phyItems.filter(item => item))

        const itemsGrp = [];
        for (const ele of details.product_item) {
            itemsGrp.push({id: ele.uuid, ...ele});
        }

        const coverJobs = [details.topbanner.url,...itemsGrp.map((ele) => ele.cover.url).flat()]
        topbannerHelper(coverJobs)        
                
        
        return Promise.all(digiItems.map(ele => checkPaid(ele.uuid)))
            .then(res => {
                digiItems.forEach((ele, index) => {
                    const item = itemsGrp.find(item => item.id === ele.uuid);
                    item.paid = res[index];
                })
                // debugger;
                setItems(itemsGrp);
            });
    };

    const getFeedbackHelper = () => {
        return fetch.get(new URL(`/api/resource/feedback/${uuid}`, baseURL))
    }

    const getProductPay = (product_item_uuid) => {
        return fetch.get(new URL(`/api/product/pay/${product_item_uuid}`, baseURL));
    }

    const checkPaid = (product_item_uuid) => {
        return apiCatcher(dispatch, getProductPay, product_item_uuid)
    }

    const getFeedbackData = () => {
        return apiCatcher(dispatch, getFeedbackHelper)
            .then((result) => {
                setFeedbackData(result);
                dispatch({
                    type: MENU_RESOURCE_FEEDBACK,
                    payload: {feedback: result.status},
                });
                setLikeStat(result.like);
                setSubscribeStat(result.subscribe);
            })
    }

    const handleDownload = async (result) => {
        debugger;
        let downloadUrl;
        if (isADraft) {
            downloadUrl = URL.createObjectURL(await getFileByUrl(result));
        } else {
            s3Catcher(dispatch,'downloadProfile',result)
            .then((result)=>{
                debugger;
                downloadUrl = result
            })
        }
        debugger;
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

    const getFileName = (data) => {
        // debugger
        const {file} = $readPath(data)
        return file;
    }

    useEffect(() => {
        if (!isADraft) {
            _getComments(uuid);
            getFeedbackData();
        }
    }, []);

    const renderContent = () => {
        return (
            <div className="w-full flex p-4 items-center">
                <div className="w-full">
                        <span className="break-all whitespace-normal p-2 ">
                            {
                                <MDEditor editorState={(details.content) ?? ''} clear={false}
                                          editable={false}/>
                            }
                        </span>
                </div>
            </div>
        )
    }

    const downloadAll = (urlArr) => {
        return Promise.all((urlArr).map((url) => {
            return handleDownload(url)
        }))
    }

    const renderTags = () => {
        return (
            <div className="w-auto flex gap-3 items-center justify-center py-2">
                {(details?.tags?.length !== 0) &&
                    <div className="flex flex-col w-full items-start justify-start gap-3">
                        <div className="flex flex-wrap gap-3">
                            {details.tags?.map((ele, ind) => {
                                return (
                                    <>
                                        <div className="w-auto flex" key={ind}>
                                            {getTagType(ele)}
                                        </div>
                                        
                                    </>
                                    
                                )
                            })}
                        </div>
                    </div>}
            </div>
        )
    }

    const renderComments = () => {
        return (
            <div className="container mx-auto flex flex-col rounded items-center px-5 py-5 pb-8">
                <div className="pt-2"> Comments</div>
                {
                    (comments != null)
                    &&
                    comments.map((comment, index) => {
                        return (
                            <div className="container mx-auto w-full py-4" key={index}>
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
            <div className="w-auto flex flex-col gap-3 items-center">
                <div className="flex items-center gap-3 w-full">
                    <div className='flex gap-1 items-center justify-center'>
                        {
                            (feedbackData?.status?.like)
                                ?
                                <img src={LikeFillSVG} alt=""/>
                                :
                                <img src={LikeSVG} alt=""/>
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
                                <img src={SubsFill} alt=""/>
                                :
                                <img src={SubsSVG} alt=""/>
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

    const helper = (data) => {
        if(data.length != 0){
            setTopBannerLink(data[0].data)
        } else {
            return (
                <GHLoading/>
            )
        }
    }

    const handleChangeTopBanner = (data) => {
        setTopBannerLink(data)
    }

    const renderItemContent = () => {
        if(curItemDetail.type === "bundle"){
            return (
                <div className="flex gap-1">
                    <p>Content:</p>                              
                    {                                                                                                            
                        curItemDetail.content.map((ele,index)=>{
                            return(
                                <p key={index} className="px-1">
                                    {ele.name},
                                </p>
                            )
                        })
                    }
                </div>
            )
        } else if(curItemDetail.type === "digital"){
            return (                
                <div className="flex gap-1">
                    <p>Content:</p>
                    {
                        curItemDetail.content.map((ele,index)=>{
                            return (
                                <p key={index}>{getFileName(ele)}</p>
                            )
                        })
                    }
                </div>
            )
        } else {
            return (
                <div className="flex gap-1">
                    <p>Content:</p>
                    <p>{curItemDetail.content}</p>
                </div>
            )
        }
    }

    const renderResourceHeader = () => {
        return (
            <>
                <div className="flex gap-2 justify-center w-full py-4">
                    <div className="w-full flex lg:grid lg:grid-cols-2 md:flex-wrap sm:flex-wrap xs:flex-wrap items-center justify-start gap-4 px-10">
                        <div className="w-full flex items-center justify-center">
                            <div className="w-full flex items-start justify-center flex-col gap-3 pl-4">
                                <div className="flex w-auto items-center gap-2">
                                    <AvatarImage avatar={username} width={6}/>
                                    <h3 className="font-thin text-2xl">{username}</h3>
                                </div>
                                <div className="flex flex-col items-start w-auto gap-3">
                                    {
                                        (secondaryTitle != null)
                                            ?
                                            <>
                                                <h1 className="text-start font-bold text-xl text-gray-400">
                                                    {title}
                                                </h1>                                                
                                                <h1 className="w-full text-start font-bold text-5xl overflow-none truncate">
                                                    {secondaryTitle}
                                                </h1>
                                                <h3 className="w-full text-start font-bold text-xl py-1 text-gray-500">
                                                    10K sold
                                                </h3>
                                            </>
                                            :
                                            <>
                                                <h1 className="w-full text-start font-bold text-5xl overflow-none truncate">
                                                    {title}
                                                </h1>
                                                <h3 className="w-full text-start font-bold text-xl py-3 text-gray-500">
                                                    10K sold
                                                </h3>
                                            </>

                                    }
                                </div>                                
                                <div className="w-full flex items-center justify-start">
                                    <p className="w-4/5 text-start line-clamp-3">
                                        {description}                                        
                                    </p>
                                </div>
                                {renderTags()}
                                {!isADraft && renderInteraction()}
                                {
                                    price
                                    &&
                                    <div className="flex flex-col py-5 gap-5">                                    
                                        <h1 className="text-5xl font-bold">                                                                                
                                            ${price}
                                        </h1>
                                        <div className="w-full flex flex-col">
                                            <p className="capitalize">Type: {curItemDetail.type}</p>
                                            {
                                                renderItemContent()
                                            }
                                        </div>
                                        <div className="flex w-fit p-1 rounded-xl gap-3 border border-lime-400/40">
                                            <button
                                                onClick={(e) => {  
                                                    debugger;                                                   
                                                    productPay(e,curItemDetail.uuid,curItemDetail.type)
                                                }}
                                                className="px-3 py-1 text-2xl bg-gradient-to-t from-lime-700 via-lime-500 to-lime-300/30 shadow-2xl shadow-black hover:shadow-none hover:from-lime-600 hover:via-lime-600 hover:to-lime-600 text-white font-bold rounded-xl"
                                            >
                                                {
                                                    (curItemDetail.type === "donation")
                                                    ?
                                                    <p>
                                                        Donate
                                                    </p>
                                                    :
                                                    <p>
                                                        Buy Now
                                                    </p>
                                                }                                                
                                            </button>
                                            {
                                                (curItemDetail.type === "physical" || curItemDetail.type === "donation")
                                                &&
                                                <input 
                                                className="w-20 border bg-gray-100/50 px-2 text-center rounded-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                min={1}
                                                onChange={(e)=>{
                                                    if(curItemDetail.type === "donation")                                                    
                                                        handleDonate(e, curItemDetail.uuid)
                                                    else 
                                                        changePrice(e, curItemDetail.uuid)                                                    
                                                }}
                                                placeholder={(curItemDetail.type === "donation")?"Amount":"Qty"}
                                                type="number" name="" id="" />
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="w-full flex flex-col items-center justify-center">

                            {
                            (topBannerList.length != 0 && TopBannerLink != null)
                                ?
                                <div className="flex gap-5">
                                    <img className="w-3/4 h-fit object-fit rounded-lg"                                                               
                                    src={TopBannerLink}
                                    alt="TopBanner"/>
                                    <div className="flex flex-col w-1/4 gap-3">
                                        {
                                            topBannerList.map(({data},index)=>{
                                                return (
                                                    <button key={index} onClick={(e)=>{handleChangeTopBanner(data)}}>
                                                        <img className="w-20 border rounded-lg" src={data} alt="" />
                                                    </button>
                                                )
                                            })

                                        }
                                    </div>
                                </div>

                                :
                                <>
                                    {
                                        
                                        helper(topBannerList)
                                    }
                                </>
                            }
                            {/* <div className="flex flex-wrap flex-cols-3 items-center justify-center gap-5 py-5">
                                {
                                    renderVariations(items)
                                }
                            </div> */}
                        </div>
                    </div>
                </div>
            </>
        )
    }


    // const mockLoader = async(url) => {
    //     const file = await getFileByUrl(url);
    //     return(genImagePreviewURL(file));
    // }
    const changeTopbannerItem = (id) => {
        const ref = items.find((ele) => ele.id === id)
        setSecondaryTitle(ref.name)
        // debugger;
        if(ref.type === "bundle"){
            const item_details = ref.item_arr.map((ele)=>{return items.find((item) => ele.uuid === item.uuid)})            
            setCurItemDetail({type:ref.type, content: item_details, uuid:ref.id})            
        } else if(ref.type === "digital"){
            setCurItemDetail({type:ref.type, content:ref.download.files.map((ele) => ele.url), uuid:ref.id})    
         } else {
            setCurItemDetail({type:ref.type, content:ref.name, uuid:ref.id})
        }
        if(ref.discount_ratio != 1){
            setPrice((ref.unit_amount / 100 * ref.discount_ratio).toFixed(2))
        } else {
            setPrice((ref.unit_amount / 100).toFixed(2))
        }
        setDescription(ref.description)
        const {data} = topBannerList.find((ele) => ele.link === ref.cover.url)
        setTopBannerLink(data)
        // topBannerList
        // debugger;

        // loadProductItemPricing(id)

        // debugger;
        // fetchImage(ref.cover.url).then((link) => {
        //     setTopBannerLink(link);
        // });

    }

    const dropdownHandler = (e, id) => {
        // debugger;
        e.stopPropagation()
        if (document.getElementById(id).classList.contains('hidden'))
            document.getElementById(id).classList.replace('hidden', 'visible')
        else
            document.getElementById(id).classList.replace('visible', 'hidden')
    }

    const productPay = (e, item_uuid, type) => {
        // debugger;
        // e.stopPropagation();
        if(!donateState)
            switch (type) {
                case 'digital':
                    directPayRef.current.initPay(item_uuid, 1)
                    break;
                case 'physical':
                    curItemDetail
                    debugger;
                    const {qty} = physicalQty.find(ele => ele.id === item_uuid)
                    directPayRef.current.initPay(item_uuid, qty, true)
                    break;
                case 'donation':
                    // debugger;
                    const {amount} = donateAmount.find(ele => ele.id === item_uuid)
                    directPayRef.current.initPay(item_uuid, amount)
                    break;
                case 'service':
                    // todo: here I set the quantity to 1,is it good?
                    directPayRef.current.initPay(item_uuid, 1)
                    break;

                case 'bundle':
                    directPayRef.current.initPay(item_uuid, 1)
                    break;
                default:
                    break;
            }
    }

    const render_price = (data) => {
        // debugger;
        if (data.discount_ratio === 1)
            return (
                <>
                        <span
                            // onClick={(e) => {
                            //     productPay(e, data.uuid, data.type)
                            // }}
                            className="flex gap-1 p-2 rounded-lg hover:shadow-none text-black">
                            <p>{currencies[data.currency.toLowerCase()]}</p>
                            <p
                                id={(data.id + "_12")}
                            >{(data.unit_amount / 100).toFixed(2)}</p>                            
                        </span>
                </>

            )
        else
            return (
                <span
                    // onClick={(e) => {
                    //     productPay(e, data.uuid, data.type)
                    // }}
                    className="flex gap-2 p-2 rounded-lg hover:shadow-none text-black"
                >
                        <p>{currencies[data.currency.toLowerCase()]}</p>
                        <p
                            id={data.id + "_12"}
                        >{(data.unit_amount / 100 * data.discount_ratio).toFixed(2)}</p>
                        <p className="line-through text-gray-500">${data.unit_amount / 100}</p>
                    </span>
            )
    }

    const getPrice = (item) => {
        if (item.status !== "ready") {
            return (
                <p className="text-gray-400">
                    Pending...
                </p>
            )
        } else {

            switch (item.type) {
                case 'digital':
                    if (item.paid) {
                        // debugger;
                        const {download} = details.product_item.find(ele => ele.uuid === item.uuid)
                        return (
                            <span
                                className="flex gap-2 cursor-pointer border-2 p-2 rounded-lg shadow-xl hover:shadow-none bg-blue-500 text-white"
                                onClick={_ => {
                                    downloadAll(download.files.map(val => val.url))
                                }}
                            >
                                <p>Download</p>
                            </span>
                        )
                    } else {
                        return (
                            <>
                                {render_price(item)}
                            </>
                        )
                    }
                case 'donation':
                    return (
                        <span 
                        onClick={(e)=>{dropdownHandler(e,item.id)}}
                        className="underline decoration-2 decoration-green-600 ">Donate</span>
                    )

                default:
                    return (
                        <>
                            {render_price(item)}
                        </>
                    )
            }
        }
    }

    const typeForQuantity = ({type,quantity}) => {
        if(type != 'physical'){
            return true
        } else {
            return (quantity > 0) ? true : false
        }
    }

    const renderVariations = (items) => {
        // const price = priceData.find(ele => ele.id === id)            
        return (items??[]).map((item,index)=>{
            if(item.status != 'ready'){
                return(
                    <Fragment key={index}>
                        <button
                        className="w-auto cursor-pointer shadow-xl border rounded-lg hover:shadow-none focus:border-green-600 focus:shadown-none"
                        onClick={() => {
                            changeTopbannerItem(item.id)
                        }}>
                        <div
                            className="w-auto h-auto flex flex-col">
                            <div className="w-full flex items-center justify-between gap-5 p-2">
                                <div className="w-auto flex flex-col items-start justify-start">
                                    <p className="w-full font-semibold text-start w-full overflow-x-hidden truncate">{item.name}</p>
                                    <p className="font-light italic text-xs capitalize">{item.type}</p>
                                </div>
                                <div className="w-auto flex items-center justify-end gap-3">
                                    <div className="flex gap-1">
                                        {/* <p>{item.unit_amount}</p>
                                    <p>{item.currency}</p> */}
                                        {/* {getPrice(item)} */}
                                        <p>Pending...</p>
                                    </div>
                                    {/* <span
                                        onClick={(e) => {
                                            (item.status === "ready") && dropdownHandler(e, item.id)
                                        }}
                                        className="w-auto h-auto bg-blue-600 p-1 text-white flex items-center justify-center rounded-md">
                                    <GoChevronDown/>
                                </span> */}
                                </div>
                            </div>
                        </div>
                        <div id={item.id}
                             className="hidden border rounded-b-lg flex flex-col h-auto w-auto bg-gray-200 items-center justify-center p-5 gap-5">
                            {
                                checkProductType(item)
                            }
                        </div>
                    </button>
                    </Fragment>
                )
            }
            else if(typeForQuantity(item)) 
                return (
                <Fragment key={index}>
                    <button
                        className="w-auto cursor-pointer shadow-xl border rounded-lg hover:shadow-none focus:border-green-600 focus:shadown-none"
                        onClick={() => {
                            changeTopbannerItem(item.id)
                        }}>
                        <div
                            className="w-auto h-auto flex flex-col">
                            <div className="w-full flex items-center justify-between gap-5 p-2">
                                <div className="w-auto flex flex-col items-start justify-start">
                                    <p className="font-semibold text-start w-full overflow-x-hidden truncate">{item.name}</p>
                                    <div className="w-full flex items-center gap-3">
                                        <p className="font-light italic text-xs capitalize">{item.type}</p>
                                        {
                                            (item.type === "physical" || item.type === "service")
                                            &&
                                            <p className="text-xs font-semibold capitalize text-red-600"> Left - {item.quantity}</p>
                                        }
                                    </div>
                                    {/* <p className="text-xs text-gray-500 font-bold">80% sales</p> */}
                                </div>
                                <div className="w-auto flex items-center justify-end gap-3">
                                    <div className="flex gap-1">
                                        {/* <p>{item.unit_amount}</p>
                                    <p>{item.currency}</p> */}
                                        {getPrice(item)}
                                    </div>
                                    {/* <span
                                        onClick={(e) => {
                                            (item.status === "ready") && dropdownHandler(e, item.id)
                                        }}
                                        className="w-auto h-auto bg-blue-600 p-1 text-white flex items-center justify-center rounded-md">
                                    <GoChevronDown/>
                                </span> */}
                                </div>
                            </div>
                        </div>
                        <div id={item.id}
                             className="hidden border rounded-b-lg flex flex-col h-auto w-auto bg-gray-200 items-center justify-center p-5 gap-5">
                            {
                                checkProductType(item)
                            }
                        </div>
                    </button>
                </Fragment>
                )
            else 
                return (
                    <Fragment key={index}>
                    <button
                        className="w-auto cursor-pointer shadow-xl border rounded-lg hover:shadow-none focus:border-green-600 focus:shadown-none"
                        onClick={() => {
                            changeTopbannerItem(item.id)
                        }}>
                        <div
                            className="w-auto h-auto flex flex-col">
                            <div className="w-full flex items-center justify-between gap-5 p-2">
                                <div className="w-auto flex flex-col items-start justify-start">
                                    <p className="font-semibold text-start w-full overflow-x-hidden truncate">{item.name}</p>
                                    <p className="font-light italic text-xs capitalize">{item.type}</p>
                                </div>
                                <div className="w-auto flex items-center justify-end gap-3">
                                    <div className="flex gap-1">
                                        {/* <p>{item.unit_amount}</p>
                                    <p>{item.currency}</p> */}
                                        <p>Sold out!</p>
                                    </div>
                                    {/* <span
                                        onClick={(e) => {
                                            // (item.status === "ready") && dropdownHandler(e, item.id)
                                        }}
                                        className="w-auto h-auto bg-blue-600 p-1 text-white flex items-center justify-center rounded-md">
                                    <GoChevronDown/>
                                </span> */}
                                </div>
                            </div>
                        </div>
                        <div id={item.id}
                             className="hidden border rounded-b-lg flex flex-col h-auto w-auto bg-gray-200 items-center justify-center p-5 gap-5">
                            {
                                checkProductType(item)
                            }
                        </div>
                    </button>
                </Fragment>
                )
        })
    }

    const checkProductType = (item) => {
        switch (item.type) {
            case 'digital':
                // debugger;
                const {download} = items.find(ele => ele.id === item.id)
                return (
                    <>
                        <div className="w-auto h-auto flex gap-3">
                            {
                                (download)
                                &&
                                download?.fileTypes.map((ele, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <p className="text-white font-semibold">
                                                {getPillIcon(ele)}
                                            </p>
                                        </Fragment>
                                    )
                                })}
                        </div>
                        <hr className="w-full text-gray-500 bg-gray-500"/>
                        <div className="w-full h-auto flex flex-col">
                            {
                                (download)
                                &&
                                download?.files.map(({url}, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {
                                                typeDigital(url,item)
                                            }
                                        </Fragment>
                                    )
                                })
                            }
                        </div>
                    </>
                )


            case 'physical':
                return (<>{typePhysical(item)}</>)

            case 'service':
                return (<>{typeService(item)}</>)

            case 'donation':
                return (<>{typeDonation(item)}</>)
            case 'bundle':
                return (<>{typeBundle(item)}</>)
            default:
                break;
        }
    }


    const typeService = (item) => {
        // debugger;
        return(
            <>
                <div className="flex flex-col gap-3">
                    <div className="flex px-3">
                        <p>{item.description}</p>
                    </div>
                    <div className="flex ">
                        <p>Support:</p>
                        <p className="w-full px-3 truncate overflow-none line-clamp-3 font-semibold">{item.duration} - Days</p>
                    </div>
                </div>
            </>
        )
    }

    const typeBundle = (url) => {
        const {item_arr} = url;
        // items
        // debugger;
        return (
            <div className="w-full flex flex-col">
                <div className="flex w-full items-center justify-between border-b border-gray-800">
                    <p>Num</p>
                    <p>Name</p>
                    <p>Qty</p>
                </div>
                {
                    item_arr.map((ele,index)=>{
                        return(
                            <div key={index} className="w-full flex items-center justify-between gap-3 border-b border-gray-800">
                                <p>{index+1}</p>
                                <p>{getBundleItemName(ele.uuid)}</p>
                                <p>{ele.quantity}</p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const getBundleItemName = (uuid) => {
        const {name} = items.find((ele) => ele.uuid === uuid)??"NULL";
        // debugger;
        return name
    }
    
    const typeDigital = (url,item) => {
        // const price = priceData.find(ele => ele.id === id)
        // debugger;
        return (
            <>
                <div className="w-auto flex flex-col gap-3">
                    <div className="w-auto flex">
                        <p className="w-full line-clamp-3 truncate overflow-none">
                            {(item.description)&&item.description}                                     
                        </p>
                    </div>
                    <p className="font-semibold truncate overflow-x-hidden">
                        {getFileName(url)}
                    </p>
                </div>
            </>
        )
    }

    const typePhysical = (item) => {
        // const price = priceData.find(ele => ele.uuid === id)
        // debugger;
        return (
            <>
                {
                    (item.status === "ready")
                        ?
                        <div className="w-auto flex flex-col gap-3">
                            <div className="w-auto flex">
                                <p className="w-full line-clamp-3 truncate overflow-none">
                                    {item.description}                                     
                                </p>
                            </div>
                            <div className="w-auto flex gap-3">
                                <p>${item.unit_amount / 100}</p>
                                <p>X</p>
                                <input
                                    id={item.id}
                                    onChange={(e) => {
                                        changePrice(e, item.id, item.unit_amount / 100)
                                    }}
                                    className="w-20 rounded-md px-1"
                                    min={0}
                                    type="number"
                                    placeholder="Qty"
                                />
                            </div>
                        </div>
                        :
                        <p>None</p>
                }
            </>
        )
    }

    const typeDonation = (item) => {
        return (
            <div className="w-auto flex flex-col gap-3 items-center justify-center">
                <div className="w-auto flex">
                    <p className="w-full line-clamp-3 truncate overflow-none">
                        {item.description}                                     
                    </p>
                </div>
                <div className="flex gap-3">
                    <input
                        className="w-20 rounded-md px-1"
                        onChange={(e) => {
                            handleDonate(e, item)
                        }}
                        min="1"
                        placeholder="cents"
                        type={"number"}
                        required={true}
                    />
                    {
                        (donateState)
                        &&
                        <p className="text-red-600">Donate amount can't be less than zero</p>
                    }
                    {/* <span
                        onClick={(e) => {
                            productPay(e, item.id, item.type)
                        }}
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white">
                        Donate
                    </span> */}
                </div>
            </div>
        )
    }

    const changePrice = (e, id) => {
        // curItemDetail
        // debugger
        if (/^\d+$/.test(e.target.value) && e.target.value != 0) {
            // document.getElementById((id + "_12")).innerText = String(Number(e.target.value) * Number(origin_price))            
            const {unit_amount} = details.product_item.find((ele) => ele.uuid === id);            
            setPrice(prev => (e.target.value * unit_amount / 100).toFixed(2))
            if (physicalQty.find(ele => ele.id === id)) {
                // debugger;
                physicalQty.find((ele) => {
                    if (ele.id === id) {
                        ele.qty = parseInt(e.target.value)
                    }
                })
                // physicalQty
                // debugger;
                setPhysicalQty(physicalQty)
                // $debounce(() => {
                // }, 3000, genUUID())
            } else {
                setPhysicalQty(prev => [...prev, {id, qty: e.target.value}])
            }

        }
    }

    const handleDonate = (e, item) => {  
        // debugger                                  
            if (/^\d+$/.test(e.target.value) && Number(e.target.value) > 0) {   
                setDonatetState(false);             
                if (donateAmount.find(ele => ele.id === item)) {
                    // debugger;
                    donateAmount.find((ele) => {
                        if (ele.id === item) {
                            ele.amount = e.target.value
                        }
                    })
                    // debugger;
                    $debounce(() => {
                        setDonateAmount(donateAmount)
                    }, 3000, genUUID())
                } else {
                    setDonateAmount(prev => [...prev, {id: item, amount: e.target.value}])
                }

            }
            else {
                setDonatetState(true);
            }
        
    }

    const renderBody = () => {
        return (
            <div className="w-full h-full flex flex-col gap-10 bg-white">
                {renderResourceHeader()}
                <div className="w-full flex flex-wrap flex-cols-3 items-center justify-center gap-5 py-5">
                    {
                        renderVariations(items)
                    }
                </div>
                <div className="container mx-auto w-full flex px-8 gap-4">
                    {renderContent()}
                </div>
                <div className="container mx-auto flex w-full px-4">
                    {
                        (isLoggedIn)
                        &&
                        (!isADraft) &&
                        CommentSection(dispatch,uuid,username)
                    }
                </div>
                {!isADraft && renderComments()}
            </div>
        )
    }

    const loadProductItemPricing = (id) => {
        if (directPayRef.current)
            return directPayRef.current.query(id) //"12345678" ==> "priceID"
                .then((result) => {
                    // debugger;
                    return result
                });
    }

    return (
        <div className="w-full bg-white">
            <DirectPay ref={directPayRef} onPayComplete={onPayComplete}/>
            {
                renderBody()
            }
        </div>);
};
