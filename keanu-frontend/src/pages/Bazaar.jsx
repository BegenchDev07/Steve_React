import {LottieAnimation} from "../components/Lottie/index.jsx";
import {useAppDispatch} from "../redux/hooks";
import bazaarLottie from "../assets/lottie/arcade.json";
import {useState, useMemo, useRef, useEffect} from "react";
import {useAppSelector} from "../redux/hooks.js";
import {listResourceItemsByTag} from "../services/API/resource";
import {Masonry, MasonryContext} from "../components/Masonry/index.js";
import {BazaarWrapper} from "../components/Wrapper";
import {ProfileDummy} from "../components/Dummy/index.js";
import {ProfileItem} from "../components/SuspenseItem";
import {Link, useLocation} from "react-router-dom";
import {apiCatcher} from "../utils/apiChecker";
import {fetchImageDataURL, getS3} from "../utils/reader";

const waitForever = _ => new Promise(res => setTimeout(res, 1000000));

export default function Bazaar() {
    const [urlTags, setUrlTags] = useState(null);

    const currUrl = useLocation()

    const extractUserName = () => {
        const pathname = currUrl.pathname;
        return pathname.substring(pathname.indexOf('@') + 1);
    };

    //store the username collected from localstorage
    const [checkedUsrName, setCheckedUsrName] = useState(extractUserName());

    //get the current username from redux
    const currentUserName = useAppSelector((state) => state.auth?.user?.username);

    //compare for the user
    const isCurrentUser = checkedUsrName === currentUserName;

    const dispatch = useAppDispatch();

    const getData = (skip, take) => {
        return apiCatcher(dispatch, listResourceItemsByTag, 'product', urlTags, skip, take)
            .then(resourceArr => {
                    return resourceArr.map(({resource, feedback}) => {
                        return ({
                            uuid: resource.uuid,
                            type: resource.type,
                            title: resource.title,
                            feedback,
                            create_time: resource.create_time,
                            url: resource.cover.url,
                            width: resource.cover.width,
                            height: resource.cover.height,
                            username: resource.user.username,
                            product: (resource.product) && resource.product[0],
                            description: resource.description
                        })
                    })
                }
            )
    };

    const fetch = ({url}) => {
        if (url === null) {
            return waitForever();
        } else if (url.startsWith("data")) { //blob
            return url;
        } else
            return fetchImageDataURL(getS3(), url);
    }

    const masonryContext = useMemo(() => ({
        Dummy: ProfileDummy,
        Comp: ProfileItem,
        Wrap: BazaarWrapper,
        auth: isCurrentUser
    }), []);

    const masonryRef = useRef();

    useEffect(() => {
        const params = new URLSearchParams(currUrl.search);
        if (params.getAll('tag').length !== 0) {
            setUrlTags(params.getAll('tag'));
            if (urlTags) {
                //because we only enable the masonry when we have the url tags
                //so we need this check
                masonryRef.current.refresh(0);
            }
        }
    }, [currUrl.search])

    return (
        <>
            <div className="w-full h-full p-5">
                {/* <Link to={"/bazaar/profile"}> */}
                <div
                    className="w-full h-auto flex flex-col items-center justify-center text-center rounded-lg bg-amber-600">
                    <div className="w-full flex h-1/2 items-center justify-start">
                        <div className="w-full flex flex-col items-start justify-start text-white px-5">
                            <h1 className="text-7xl text-black font-semibold text-white">Bazaar</h1>
                            <p className="text-lg font-bold">Get inspired for your creations and explore at our bazaar
                                !</p>
                        </div>
                        <div className="w-1/2 h-auto flex justify-end items-center">
                            <LottieAnimation className={'w-1/2 h-1/2'} autoplay={true} width={800} height={600}
                                             animationData={bazaarLottie}/>
                        </div>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center h-1/2">
                    <div className="w-full overflow-x-scroll space-x-8 flex items-center justify-center gap-5 p-3">
                        {/* {
                                (urlTags)
                                &&
                                urlTags.map((ele,index)=>{
                                    return (
                                    )
                                })
                            } */}
                        <div className="h-auto w-auto bg-white rounded-full border-2 border-indie-red py-3 px-5 shadow-lg">
                            <Link
                                to={`${currUrl.pathname}?tag=2.5D`}
                                className="w-full h-full flex flex-col items-center justify-center">
                                <h3 className="text-xl font-semibold capitalize">2.5D</h3>
                            </Link>
                        </div>
                        <div className="h-auto w-auto bg-white rounded-full border-2 border-indie-red py-3 px-5 shadow-lg">
                            <Link
                                to={`${currUrl.pathname}?tag=3D`}
                                className="w-full h-full flex flex-col items-center justify-center">
                                <h3 className="text-xl font-semibold">3D</h3>
                            </Link>
                        </div>
                        <div className="h-auto w-auto bg-white rounded-full border-2 border-indie-red py-3 px-5 shadow-lg">
                            <Link
                                to={`${currUrl.pathname}?tag=FPS`}
                                className="w-full h-full flex flex-col items-center justify-center">
                                <h3 className="text-xl font-semibold">FPS</h3>
                            </Link>
                        </div>
                        <div className="h-auto w-auto bg-white rounded-full border-2 border-indie-red py-3 px-5 shadow-lg">
                            <Link
                                to={`${currUrl.pathname}?tag=Arcade`}
                                className="w-full h-full flex flex-col items-center justify-center">
                                <h3 className="text-xl font-semibold">Arcade</h3>
                            </Link>
                        </div>
                        <div className="h-auto w-auto bg-white rounded-full border-2 border-indie-red py-3 px-5 shadow-lg">
                            <Link
                                to={`${currUrl.pathname}?tag=2D`}
                                className="w-full h-full flex flex-col items-center justify-center">
                                <h3 className="text-xl font-semibold">2D</h3>
                            </Link>
                        </div>
                        <div className="h-auto w-auto bg-white rounded-full border-2 border-indie-red py-3 px-5 shadow-lg">
                            <Link
                                to={`${currUrl.pathname}?tag=Shooter`}
                                className="w-full h-full flex flex-col items-center justify-center">
                                <h3 className="text-xl font-semibold">Shooter</h3>
                            </Link>
                        </div>
                        <div className="h-auto w-auto bg-white rounded-full border-2 border-indie-red py-3 px-5 shadow-lg">
                            <Link
                                to={`${currUrl.pathname}?tag=Action`}
                                className="w-full h-full flex flex-col items-center justify-center">
                                <h3 className="text-xl font-semibold">Action</h3>
                            </Link>
                        </div>
                        <div className="h-auto w-auto bg-white rounded-full border-2 border-indie-red py-3 px-5 shadow-lg">
                            <Link
                                to={`${currUrl.pathname}?tag=Isometric`}
                                className="w-full h-full flex flex-col items-center justify-center">
                                <h3 className="text-xl font-semibold">Isometric</h3>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="py-3 px-5">
                    {
                        (urlTags)
                        &&
                        <MasonryContext.Provider value={masonryContext}>
                            <Masonry
                                pagination={{skip: 0, take: 2}}
                                initData={_ => Promise.resolve([])}
                                getData={getData}
                                fetch={fetch}
                                // delData={handleDelete}
                                ref={masonryRef}
                            />
                        </MasonryContext.Provider>
                    }
                </div>
            </div>
        </>)
}