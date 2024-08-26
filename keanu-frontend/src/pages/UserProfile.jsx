import {useAppDispatch, useAppSelector} from "../redux/hooks.js";
import {useEffect, useMemo, useRef, useState} from "react";
import {useLocation} from "react-router-dom";
import {getUserProfile, getUserTopBanner} from "../services/API/user/index.ts";
import {listResourceItemsByUsr} from "../services/API/resource"
import {apiCatcher} from "../utils/apiChecker.js";
import {$assert, fetchImageDataURL, fetchSettings, getS3, readAsDataURL} from "../utils/reader.js";
import AvatarImage from "../components/AvatarImage";
import {Masonry, MasonryContext} from "../components/Masonry";
import {ProfileDummy} from "../components/Dummy/index.js";
import {ProfileItem} from "../components/SuspenseItem/index.js";
import {load, loadObjectArray, removeObjectArray} from "../utils/storageOperation.js";
import {getFileByUrl} from "../utils/dexie/operation.js";
import {appendDraft, clearDraft} from "../utils/urlOperation.js";
import {ProfileWrapper} from "../components/Wrapper/index.js";
import useTilg from "tilg";
import VerifyBadge from '../assets/icons/badges/Group 494.svg'
import AmateurBadge from '../assets/icons/badges/Group 496.svg'
import VirtuosoBadge from '../assets/icons/badges/Group 497.svg'

import errorAni from "../assets/lottie/404.json";
import {LottieAnimation} from "../components/Lottie/index.jsx";
import {$clipImage, Img2DataURL, readAsImage, genUUID} from "../utils/reader.js";
import {getTagType} from "../assets/icons/tag";

const TOP_BANNER_RATIO = 4;
const MODE = {loading: 1, error: 2,}
const TAKE = 2;
export default function UserProfile() {
    const [mode, setMode] = useState(null);
    const [showModal, setShowModal] = useState(false);
    //useTilg();

    const [profileData, setProfileData] = useState({
        profile: {
            description: 'xxxxxxxxxxx',
            skills: 'design,ps, ase',
            location: 'bj',
            weblink: 'null'
        }
    })

    const [avatarLink, setAvatarLink] = useState('')
    const [topBannerLink, setTopBannerLink] = useState(null)
    const dispatch = useAppDispatch();

    // get userName from the redux store
    const currentUserName = useAppSelector((state) => state.auth?.user?.username);

    // get userName from the url
    const location = useLocation(); // location.pathname the same as window.location.href
    // Extract the username from the URL whenever the location changes
    const extractUserName = () => {
        const pathname = location.pathname;
        return pathname.substring(pathname.indexOf('@') + 1);
    };

    const [checkedUsrName, setCheckedUsrName] = useState(extractUserName());

    // Create a ref to hold the latest checkedUsrName
    // euds: using ref is not a good practice, but I don't know how to fix it for now
    // todo: find an elegant way to refactor this function
    const checkedUsrNameRef = useRef(checkedUsrName);

    const isCurrentUser = checkedUsrName === currentUserName;

    const setAvatar = (blob) => readAsImage(blob)
            .then(img => setAvatarLink(img.src)),

        setTopbanner = (blob) => readAsImage(blob)
            .then(img => $clipImage(img, img.width, img.width / TOP_BANNER_RATIO))
            .then(dataURL => setTopBannerLink(dataURL));

    const fetchAuthors = async () => {
        apiCatcher(dispatch, getUserProfile, checkedUsrName)
            .then((res) => {
                const {profile} = res;
                setProfileData(profile);
                return getUserTopBanner(checkedUsrName)
                    .then(topBannerBlob => {
                        if (topBannerBlob)
                            return setTopbanner(topBannerBlob);
                    })
            })
            .catch(err => {
                debugger;
                console.error(err);
                setMode(MODE.error)
            })
    };
    const getDraft = async _ => {
        if (!isCurrentUser) return Promise.resolve([]);
        const draftUuidArray = loadObjectArray(`${currentUserName}-resource`);
        const draftArray = [];
        for (const item of draftUuidArray) {
            const {uuid, type} = item;
            const title = load(uuid, 'title') ?? 'unknown';

            let imageUrl = null,
                width = 640,
                height = 320;

            const cover = load(uuid, 'cover')?.[0] ?? null;
            if (cover) {
                width = cover.width;
                height = cover.height;
                const file = await getFileByUrl(cover.url);
                if (file) {
                    imageUrl = await readAsDataURL(file);
                }
            }

            draftArray.push({
                uuid: appendDraft(uuid),
                url: imageUrl,
                username: currentUserName,
                type,
                width,
                height,
                title
            });
        }
        return Promise.resolve(draftArray);
    }
    const initData = _=>getDraft().then(arr=>getData(0, TAKE).then(dataArr=>Promise.resolve([...arr,...dataArr])))

    const getData = (skip, take) => {
        return apiCatcher(dispatch, listResourceItemsByUsr, checkedUsrNameRef.current, skip, take)
            .then(resourceArr => resourceArr.map(({title, uuid, user, feedback, type, cover}) =>
                ({
                    uuid, url: cover.url, width: cover.width, height: cover.height,
                    feedback, title, username: user.username, type
                })))
    };

    const waitForever = _ => new Promise(res => setTimeout(res, 1000000));

    const fetch = ({url}) => {
        if (url === null || typeof url === 'undefined') {
            debugger;
            return waitForever();
        } else if (url.startsWith("data")) { //blob
            debugger;
            return url;
        } else {
            debugger;
            return fetchImageDataURL(getS3(), url);
        }
    }

    const handleDelete = (uuid) => {
        // remove the current uuid from localStorage
        // todo: need a modal to let user confirm the deletion
        return removeObjectArray(`${currentUserName}-resource`, clearDraft(uuid));
        // todo：need to enable delete from the server
    }

    // according to https://ant.design/docs/blog/render-times,this could help reduce unnecessary re-render
    const masonryContext = useMemo(() => ({
        Dummy: ProfileDummy,
        Comp: ProfileItem,
        Wrap: ProfileWrapper,
        auth: isCurrentUser
    }), []);

    const masonryRef = useRef();

    useEffect(() => {
        const nowUsrName = extractUserName();
        setCheckedUsrName(nowUsrName);
        checkedUsrNameRef.current = nowUsrName;
        setMode(prev => prev | MODE.loading);
        fetchAuthors()
            .then(_ => setMode(prev => prev ^ MODE.loading));
        masonryRef.current.refresh();
    }, [location.pathname]);

    const renderTopBanner = () => {
        return (
            <div className="flex flex-col w-full items-center justify-center mx-auto">
                <div className="w-full z-5">
                    {
                        (topBannerLink != null)
                            ?
                            <img
                                className="h-full w-full object-fit rounded-t-lg"
                                src={topBannerLink}
                                alt="topBanner"
                            />
                            :
                            <div className="w-full h-64 bg-gradient-to-r from-sky-400 to-blue-500">

                            </div>
                    }
                </div>
            </div>
        );
    }

    const renderSocialInfo = () => {
        return (
            <div className="w-full h-auto flex flex-col items-center justify-center">
                <div className="w-full h-full flex items-center justify-end gap-3 px-5 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                         className="lucide lucide-facebook">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                         className="lucide lucide-twitter">
                        <path
                            d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                         className="lucide lucide-twitch">
                        <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                         className="lucide lucide-instagram">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 50 50" strokeWidth={4}>
                        <path
                            d="M 18.90625 7 C 18.90625 7 12.539063 7.4375 8.375 10.78125 C 8.355469 10.789063 8.332031 10.800781 8.3125 10.8125 C 7.589844 11.480469 7.046875 12.515625 6.375 14 C 5.703125 15.484375 4.992188 17.394531 4.34375 19.53125 C 3.050781 23.808594 2 29.058594 2 34 C 1.996094 34.175781 2.039063 34.347656 2.125 34.5 C 3.585938 37.066406 6.273438 38.617188 8.78125 39.59375 C 11.289063 40.570313 13.605469 40.960938 14.78125 41 C 15.113281 41.011719 15.429688 40.859375 15.625 40.59375 L 18.0625 37.21875 C 20.027344 37.683594 22.332031 38 25 38 C 27.667969 38 29.972656 37.683594 31.9375 37.21875 L 34.375 40.59375 C 34.570313 40.859375 34.886719 41.011719 35.21875 41 C 36.394531 40.960938 38.710938 40.570313 41.21875 39.59375 C 43.726563 38.617188 46.414063 37.066406 47.875 34.5 C 47.960938 34.347656 48.003906 34.175781 48 34 C 48 29.058594 46.949219 23.808594 45.65625 19.53125 C 45.007813 17.394531 44.296875 15.484375 43.625 14 C 42.953125 12.515625 42.410156 11.480469 41.6875 10.8125 C 41.667969 10.800781 41.644531 10.789063 41.625 10.78125 C 37.460938 7.4375 31.09375 7 31.09375 7 C 31.019531 6.992188 30.949219 6.992188 30.875 7 C 30.527344 7.046875 30.234375 7.273438 30.09375 7.59375 C 30.09375 7.59375 29.753906 8.339844 29.53125 9.40625 C 27.582031 9.09375 25.941406 9 25 9 C 24.058594 9 22.417969 9.09375 20.46875 9.40625 C 20.246094 8.339844 19.90625 7.59375 19.90625 7.59375 C 19.734375 7.203125 19.332031 6.964844 18.90625 7 Z M 18.28125 9.15625 C 18.355469 9.359375 18.40625 9.550781 18.46875 9.78125 C 16.214844 10.304688 13.746094 11.160156 11.4375 12.59375 C 11.074219 12.746094 10.835938 13.097656 10.824219 13.492188 C 10.816406 13.882813 11.039063 14.246094 11.390625 14.417969 C 11.746094 14.585938 12.167969 14.535156 12.46875 14.28125 C 17.101563 11.410156 22.996094 11 25 11 C 27.003906 11 32.898438 11.410156 37.53125 14.28125 C 37.832031 14.535156 38.253906 14.585938 38.609375 14.417969 C 38.960938 14.246094 39.183594 13.882813 39.175781 13.492188 C 39.164063 13.097656 38.925781 12.746094 38.5625 12.59375 C 36.253906 11.160156 33.785156 10.304688 31.53125 9.78125 C 31.59375 9.550781 31.644531 9.359375 31.71875 9.15625 C 32.859375 9.296875 37.292969 9.894531 40.3125 12.28125 C 40.507813 12.460938 41.1875 13.460938 41.8125 14.84375 C 42.4375 16.226563 43.09375 18.027344 43.71875 20.09375 C 44.9375 24.125 45.921875 29.097656 45.96875 33.65625 C 44.832031 35.496094 42.699219 36.863281 40.5 37.71875 C 38.5 38.496094 36.632813 38.84375 35.65625 38.9375 L 33.96875 36.65625 C 34.828125 36.378906 35.601563 36.078125 36.28125 35.78125 C 38.804688 34.671875 40.15625 33.5 40.15625 33.5 C 40.570313 33.128906 40.605469 32.492188 40.234375 32.078125 C 39.863281 31.664063 39.226563 31.628906 38.8125 32 C 38.8125 32 37.765625 32.957031 35.46875 33.96875 C 34.625 34.339844 33.601563 34.707031 32.4375 35.03125 C 32.167969 35 31.898438 35.078125 31.6875 35.25 C 29.824219 35.703125 27.609375 36 25 36 C 22.371094 36 20.152344 35.675781 18.28125 35.21875 C 18.070313 35.078125 17.8125 35.019531 17.5625 35.0625 C 16.394531 34.738281 15.378906 34.339844 14.53125 33.96875 C 12.234375 32.957031 11.1875 32 11.1875 32 C 10.960938 31.789063 10.648438 31.699219 10.34375 31.75 C 9.957031 31.808594 9.636719 32.085938 9.53125 32.464844 C 9.421875 32.839844 9.546875 33.246094 9.84375 33.5 C 9.84375 33.5 11.195313 34.671875 13.71875 35.78125 C 14.398438 36.078125 15.171875 36.378906 16.03125 36.65625 L 14.34375 38.9375 C 13.367188 38.84375 11.5 38.496094 9.5 37.71875 C 7.300781 36.863281 5.167969 35.496094 4.03125 33.65625 C 4.078125 29.097656 5.0625 24.125 6.28125 20.09375 C 6.90625 18.027344 7.5625 16.226563 8.1875 14.84375 C 8.8125 13.460938 9.492188 12.460938 9.6875 12.28125 C 12.707031 9.894531 17.140625 9.296875 18.28125 9.15625 Z M 18.5 21 C 15.949219 21 14 23.316406 14 26 C 14 28.683594 15.949219 31 18.5 31 C 21.050781 31 23 28.683594 23 26 C 23 23.316406 21.050781 21 18.5 21 Z M 31.5 21 C 28.949219 21 27 23.316406 27 26 C 27 28.683594 28.949219 31 31.5 31 C 34.050781 31 36 28.683594 36 26 C 36 23.316406 34.050781 21 31.5 21 Z M 18.5 23 C 19.816406 23 21 24.265625 21 26 C 21 27.734375 19.816406 29 18.5 29 C 17.183594 29 16 27.734375 16 26 C 16 24.265625 17.183594 23 18.5 23 Z M 31.5 23 C 32.816406 23 34 24.265625 34 26 C 34 27.734375 32.816406 29 31.5 29 C 30.183594 29 29 27.734375 29 26 C 29 24.265625 30.183594 23 31.5 23 Z"></path>
                    </svg>
                </div>
                <div className="w-full flex">
                    <div className="w-1/2 px-5 pb-3 w-full h-fit h-auto flex items-start justify-start">
                        <div className="w-full pl-10 h-full text-start flex flex-col items-start justify-center">
                            <p className="font-bold text-5xl">{checkedUsrName}</p>
                            <p className="font-extralight ">@{checkedUsrName}</p>
                            <p className="w-full italic truncate overflow-none text-gray-500 font-semibold line-clamp-3">{profileData.description}</p>
                        </div>                    
                    </div>
                    <div className="w-1/2 flex items-center justify-end gap-3 px-5 pb-3">
                        <button className="text-lg font-semibold py-1.5 px-5 bg-blue-500 rounded-full text-white">Follow +
                        </button>
                        <button
                            className="text-lg font-semibold py-1.5 px-5 bg-blue-500 rounded-full text-white">Subscribe
                        </button>
                    </div>
                </div>
                <AvatarImage key={genUUID}
                             className={'w-40 h-40 rounded-full top-1/3 left-10 absolute border-4 border-white'}
                             avatar={checkedUsrName} width={40}/>
                
            </div>
        )

    }

    const renderIntro = () => {
        return (
            <div className="w-1/4 bg-white rounded-lg shadow-lg border">
                <div className="w-full p-5 border-b ">
                    <h1 className="text-2xl font-bold">Intro</h1>
                </div>
                <div className="w-full flex flex-col p-5 gap-3">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-slate-500 font-semibold text-lg">Badges:</h3>
                        <div className="px-3 flex items-center gap-2">
                            <img src={VerifyBadge} alt=""/>
                            <img src={AmateurBadge} alt=""/>
                            <img src={VirtuosoBadge} alt=""/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="text-slate-500 font-semibold text-lg">Tags:</h3>
                        <div className="w-full px-3 gap-3 flex flex-wrap justify-items-start">
                            {getTagType('beijing')}
                            {getTagType('3D')}
                            {getTagType('Hades')}
                            {getTagType('PixelArt')}
                            {getTagType('gamehub')}
                        </div>
                    </div>
                    <div className="w-full flex">
                        <div className="w-1/2 flex flex-col items-center">
                            <p>Total Likes</p>
                            <h1 className="font-bold text-3xl">123K</h1>
                        </div>
                        <div className="w-1/2 flex flex-col items-center">
                            <p>Total Subs</p>
                            <h1 className="font-bold text-3xl">21K</h1>
                        </div>
                        <div className="w-1/2 flex flex-col items-center">
                            <p>Weblinks</p>
                            <h1 className="font-bold text-3xl">2</h1>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderGenerativeAIModal = () => {
        if (showModal)
            return (
                <div className="w-full h-screen bg-gray-700/80 fixed z-30 flex items-center justify-center">
                    <div
                        className="w-1/2 h-1/2 flex flex-col items-center justify-center bg-white border-2 border-black rounded-xl">
                        <div className="h-full w-full flex flex-col px-4 py-3">
                            <div>

                                <button
                                    onClick={_ => {
                                        setShowModal(false)
                                    }}
                                    className="flex w-full items-start justify-end">
                                    ✖
                                </button>
                            </div>
                            <div className="w-full h-full flex flex-col items-center justify-end">
                                <div className="w-full flex gap-3">
                                    <input className="w-full h-10 border-2 border-black rounded-lg px-2" type="text"
                                           name="" id=""/>
                                    <button className="bg-blue-600 text-white px-2 rounded-lg">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
    const root = useRef(null);
    
    return (
        <>
            <main className="w-full">
                {renderGenerativeAIModal()}
                <div className="pt-0 h-screen ">
                    {mode & MODE.error ?
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-1/3">
                                <LottieAnimation autoplay={true} width={400} height={300} animationData={errorAni}/>
                            </div>
                        </div>
                        :
                        <>
                            <div ref={root} className="w-full h-auto flex flex-col gap-5 overflow-y-scroll">
                                <div className="flex pt-5 container mx-auto gap-5">
                                    <div
                                        className="w-3/4 flex flex-col min-h-96 max-h-full relative rounded-lg bg-white shadow-lg border">
                                        {renderTopBanner()}
                                        {renderSocialInfo()}
                                    </div>
                                    {renderIntro()}
                                </div>
                                {/* <div className="container flex mx-auto gap-5">
                                    <div
                                        className="flex flex-col w-1/3 items-center gap-3 p-5 rounded-lg shadow-lg border bg-white">
                                        <div className="w-full flex flex-col gap-3">
                                            <h3 className="text-slate-500 font-semibold text-lg">Generative AI:</h3>
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => setShowModal(true)}
                                                    className="rounded-xl p-2 font-semibold bg-blue-600 text-white text-xl hover:animate-pulse">
                                                    Generate
                                                </button>
                                            </div>
                                        </div>
                                        <hr className="text-gray-400 w-full"/>
                                    </div>
                                    <div
                                        className="w-2/3 p-5 rounded-lg shadow-lg border bg-white items-center justify-start flex flex-col gap-1">
                                        <h3 className="w-full text-start font-semibold text-xl border-b">About:</h3>
                                        <p className="w-full text-start line-clamp-3 text-pretty">{profileData.description}</p>
                                    </div>
                                </div> */}
                                <div
                                    className="container mx-auto flex mb-28 top-28 px-3 py-10 gap-4 col-span-1 w-screen h-full bg-white shadow-lg rounded-lg">
                                    <div className="flex justify-center w-full px-3 h-full">
                                        {
                                            <MasonryContext.Provider value={masonryContext}>
                                                <Masonry
                                                    root = {root.current}
                                                    pagination={{skip: 0, take: TAKE}}
                                                    initData={getDraft}
                                                    getData={getData}
                                                    fetch={fetch}
                                                    delData={handleDelete}
                                                    ref={masonryRef}
                                                />
                                            </MasonryContext.Provider>
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </main>

        </>
    );
}