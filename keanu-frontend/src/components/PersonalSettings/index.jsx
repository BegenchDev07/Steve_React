import AvatarImage from "../AvatarImage";
import {useRef} from "react";
import {useForm} from "react-hook-form";
import {getUserProfile, updateUserProfile, getUserTopBanner, getUserAvatar} from "../../services/API/user";
import {useEffect, useState} from "react";
import {useAppSelector, useAppDispatch} from "../../redux/hooks.js";
import {apiCatcher} from "../../utils/apiChecker";
import {FILE_UPLOAD_MODE, FileUpload} from "../FileUpload";
import {s3Catcher} from "../../utils/apiChecker";
import {createAlert} from "../../redux/reducers/AlertSlice.js";
import {updateEmail} from "../../utils/resetPassword";
import {getTagType} from "../../assets/icons/tag";
import {readAsImage, $genUploadingArr, $exeSequential} from "../../utils/reader";
import {MENU_LOADING_PROGRESS} from "../../redux/constants/menuConstants";
import { useNavigate } from "react-router-dom";

const PersonalSettings = () => {
    // much more logic to be added: 
    // for fetching and posting updates
    const {register, handleSubmit} = useForm();
    const dispatch = useAppDispatch();
    const currentUserName = useAppSelector((state) => state.auth?.user?.username);
    const {username} = JSON.parse(localStorage.getItem('user'));
    const [userData, setUserData] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [topBannerLink, setTopBannerLink] = useState(null);
    const customTagInputRef1 = useRef(null);
    const customTagInputRef2 = useRef(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [newEmail, setNewEmail] = useState(null);
    const [emailChangeStat, setEmailChangeStat] = useState(null);
    //TODO: This is quick demo attribute add this to backend later
    const [tempShippingAddress, setTempShippingAddress] = useState("")
    const navigator = useNavigate();
    // const setAvatar = (blob)=>readAsImage(blob)
    //     .then(img=> setAvatarLink(img.src));

    const handleEmailChange = (event) => {
        setNewEmail(event.target.value)
    }

    const handleEmailUpdate = () => {
        apiCatcher(dispatch, updateEmail, String(newEmail))
            .then((result) => {
                setEmailChangeStat(false);
            })
            .catch((err) => {
                setEmailChangeStat(true);
            })
    }

    const topBannerHelper = (blob) => {
        readAsImage(blob)
            .then(dataURL => setTopBannerLink(dataURL.src));
    }

    const handleNewCustomTags = (e) => {
        // we grab it from event        
        if (selectedTags.length < 5 && !selectedTags.includes(e.currentTarget.value)) {
            const nowTags = [...selectedTags, e.currentTarget.value];
            setSelectedTags(nowTags);
            // save(uuid, 'tags', nowTags);
        } else {
            dispatch(createAlert({
                type: 'error',
                message: `you can only select 5 tags`,
            }))
        }
    }


    const handleTags = (tag) => {
        if (selectedTags.length < 5 && !selectedTags.includes(tag)) {
            const nowTags = [...selectedTags, tag];
            setSelectedTags(nowTags);
            // save(uuid, 'tags', nowTags);
        } else {
            dispatch(createAlert({
                type: 'error',
                message: `you can only select 5 tags`,
            }))
        }
    }
    const handleSelectNewTags = (origin) => {
        if (origin === 'skills') {
            if (/.*\S.*/.test(customTagInputRef1.current.value))
                handleTags(customTagInputRef1.current.value)
        } else {
            if (/.*\S.*/.test(customTagInputRef2.current.value))
                handleTags(customTagInputRef2.current.value)
        }
    }

    const handleRemoveTag = (data) => {
        const filteredTags = selectedTags.filter(tag => tag !== data);
        setSelectedTags(filteredTags);
        // save(uuid, 'tags', filteredTags);
    }

    // const fetchHotTags = _ => apiCatcher(dispatch, getHotTags, 5)
    //     .then(res =>        setProvidedTags(res));

    const fetchProfileMedia = () => {
        Promise.all([getUserAvatar(currentUserName), getUserTopBanner(currentUserName)])
            .then(async (blobs) => {
                const [avatar, topbanner] = blobs;
                if (avatar) {
                    // await setAvatar(avatar)
                }

                if (topbanner) {
                    await topBannerHelper(topbanner)
                }
            })
    }


    const fetchProfile = _ => apiCatcher(dispatch, getUserProfile, currentUserName)
            .then(profile => {
                setUserData(profile)
            }),

        updateProfile = (map) => apiCatcher(dispatch, updateUserProfile, currentUserName, map);


    const submitHandler = (data) => {
        localStorage.setItem('shippingAddress', tempShippingAddress);
        const totalFileSize = Object.values(fileList).flat().reduce((acc, cur) => acc += cur.file.size, 0);

        //upload files to s3        
        if (currentUserName === username) {
            const paramArr = $genUploadingArr(fileList,
                (flag, fileName) => `${currentUserName}/.profile/${flag}.png`,
                loadedSize => dispatch({
                    type: MENU_LOADING_PROGRESS,
                    payload: {status: 'progress', progress: loadedSize / totalFileSize},
                }),
                path => /index\.json/.test(path)
            );
            const dummyFnc = (...params) => s3Catcher(dispatch, 'uploadProfile', ...params)


            return $exeSequential(dummyFnc, paramArr).then(_ => {

                //upload data to backend
                const ref = new Map(Object.entries(data))
                updateProfile(ref)
            }).then(_ => 
                {
                    dispatch({
                        type: MENU_LOADING_PROGRESS,
                        payload: {status: 'stop', progress: 1},
                    })
                    navigator(`/@${currentUserName}`)
                }
            );
        } else {
            dispatch(createAlert({
                type: 'error',
                message: 'sorry, authorize as yourself to do this action'
            }))
        }
    }


    const getURL = (file, flag) => {
        return {
            url: String(`${currentUserName}/.profile/${flag}.png`),
            file: file
        }
    }

    const handleFilesChange = (files, flag) => {

        // setFileList(prev => ({
        //     ...prev,
        //     [flag]:files
        // }))                        
        setFileList(prev => ([...prev, getURL(files[0], flag)]))
    };


    useEffect(_ => {
        fetchProfile();
        fetchProfileMedia();
    }, [])
    return (
        <>
            <div className="w-full h-full flex justify-center">
                <div className="w-2/3 flex flex-col gap-3">
                    <div className="flex gap-2 w-full">
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col gap-3 w-full py-3">
                                <label className="font-semibold text-2xl">
                                    Tags:
                                </label>
                                <div className="w-full flex gap-3 px-3">
                                    <div className="w-auto">
                                        {/* <h3 className="text-xl font-semibold">Tags:</h3> */}
                                    </div>
                                    <div className="flex gap-3 w-5/6">
                                        <input type="text" name="title" ref={customTagInputRef1}
                                               className="w-full hover:outline focus:outline px-2 py-0.5 rounded-lg"
                                               placeholder="Enter the skill, game, genre, software or etc."/>

                                        <a onClick={() => {
                                            handleSelectNewTags('skills')
                                        }}
                                           className="flex items-center bg-blue-600 text-white rounded-md px-1 py-1 text-center no-underline cursor-pointer">
                                            add
                                        </a>
                                    </div>
                                </div>
                                <div
                                    className="flex w-full justify-start items-start px-2 border-2 rounded-lg px-3 py-2">
                                    {
                                        (selectedTags?.length != 0) &&
                                        <div className="grid grid-cols-2 gap-1 justify-items-center self-start">
                                            {selectedTags?.map((ele, index) => {
                                                return (
                                                    <>
                                <span id={index} onClick={() => {
                                    handleRemoveTag(ele)
                                }}>
                                <svg className=" -top-2 -left-1.5 icon cursor-pointer" viewBox="0 0 1024 1024"
                                     version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2792" width="10"
                                     height="10"><path
                                    d="M512 455.431L794.843 172.59a8 8 0 0 1 11.313 0l45.255 45.255a8 8 0 0 1 0 11.313L568.57 512 851.41 794.843a8 8 0 0 1 0 11.313l-45.255 45.255a8 8 0 0 1-11.313 0L512 568.57 229.157 851.41a8 8 0 0 1-11.313 0l-45.255-45.255a8 8 0 0 1 0-11.313L455.43 512 172.59 229.157a8 8 0 0 1 0-11.313l45.255-45.255a8 8 0 0 1 11.313 0L512 455.43z"
                                    p-id="2793" fill="#515151"></path></svg>
                                    {getTagType(ele)}
                                </span>
                                                    </>
                                                )
                                            })}
                                        </div>
                                    }
                                </div>
                                {/* <div className="w-full flex gap-3 px-3">
                                    <div className="flex w-auto">
                                        <h3 className="text-xl font-semibold">Game Genre:</h3>
                                    </div>
                                    <div className="flex gap-3 w-4/5">
                                        <input type="text" name="title" ref={customTagInputRef2}
                                            className="w-full hover:outline focus:outline px-2 py-0.5 rounded-lg" placeholder="Enter the genre"/>                                        
                                        <a onClick={handleSelectNewTags}
                                        className="border bg-blue-600 text-white rounded-md px-1 pt-1 text-center no-underline cursor-pointer">
                                            add
                                        </a>
                                    </div>
                                </div>                                                                 */}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-full items-center">
                        <h1 className="w-full text-start font-semibold">Avatar:</h1>
                        <div className="w-full flex">
                            <div className="w-1/3 flex items-center justify-center">
                                <AvatarImage width={40}/>
                            </div>
                        </div>
                        <FileUpload mode={FILE_UPLOAD_MODE.single}
                                    onFilesChange={newFiles => handleFilesChange(newFiles, 'avatar')}
                                    fileType={'image/*'}
                                    initFiles={[]}/>
                    </div>
                    <div className="w-full flex flex-col gap-3 text-start font-semibold">
                        <h1 className="w-full text-start font-semibold">Top Banner:</h1>
                        <div className="w-full h-48 px-4 flex items-center justify-center">
                            {
                                (topBannerLink)
                                &&
                                <img className="h-full w-1/2 object-fit rounded-md" src={topBannerLink} alt=""/>
                            }
                        </div>
                        <div className="w-full h-auto">
                            <FileUpload mode={FILE_UPLOAD_MODE.single}
                                        onFilesChange={newFiles => handleFilesChange(newFiles, 'topbanner')}
                                        fileType={'image/*'}
                                        initFiles={[]}/>
                        </div>

                    </div>
                    <div className="w-full flex flex-col py-4 gap-3">
                        <h1 className="w-full text-start font-semibold">Update email:</h1>
                        <div className="w-full flex gap-3">
                            <form className="w-full" onSubmit={handleSubmit(handleEmailUpdate)}>
                                <input type="email" onChange={handleEmailChange} name="email" id=""
                                       className="w-full rounded-lg px-1 py-1" placeholder="Email"/>
                                <input type="submit" value="" hidden/>
                            </form>
                            {/* <button className="px-2 py-1 text-lg font-semibold text-white bg-blue-600 w-1/6 rounded-lg" onClick={handleEmailUpdate} >Submit</button> */}
                        </div>
                        <div className="w-full">
                            {
                                (emailChangeStat === true)
                                    ?
                                    <p className="text-red-600 font-semibold">Something went wrong while updating email
                                        !</p>
                                    :
                                    <p className="text-green-600 font-semibold">Success !</p>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-3">
                        <h1 className="w-full text-start font-semibold">User data:</h1>
                        <form id={`submitForm`} onSubmit={handleSubmit(submitHandler)}>
                            <div className="gap-3 grid grid-rows-2 grid-flow-col">
                                <input
                                    defaultValue={(userData != null) ? userData.profile.description : ''} {...register('description')}
                                    type="text" className="rounded px-1 py-1" placeholder="Description"/>
                                <input
                                    defaultValue={(userData != null) ? userData.profile.location : ''} {...register('location')}
                                    type="text" className="rounded px-1 py-1" placeholder="Location"/>
                                <input
                                    defaultValue={(userData != null) ? userData.profile.skills : ''} {...register('skills')}
                                    type="text" className="rounded px-1 py-1" placeholder="Skills"/>
                                <input
                                    defaultValue={(userData != null) ? userData.profile.weblink : ''} {...register('weblink')}
                                    type="text" className="rounded px-1 py-1" placeholder="Weblink"/>
                            </div>

                            <div className="flex flex-col w-full gap-3 pb-3">
                                <h1 className="w-full text-start font-semibold">Shipping Address:</h1>

                                <div className="gap-3 grid grid-rows-2 grid-flow-col">
                                    <input
                                        defaultValue={localStorage.getItem('shippingAddress') ? localStorage.getItem('shippingAddress') : ''}
                                        onChange={(e) => {
                                            setTempShippingAddress(e.target.value)
                                        }} type="text" className="rounded px-1 py-1" placeholder="Shipping Address"/>
                                </div>

                            </div>
                            {/*<div className="w-full flex items-center justify-end pb-10">*/}
                            {/*    <button className="w-auto text-lg px-1 py-2 text-white bg-blue-600 border-gray-400 rounded-md" */}
                            {/*            type="submit" */}
                            {/*            onClick={()=>{localStorage.setItem('shippingAddress', tempShippingAddress)}}>*/}
                            {/*        Submit*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PersonalSettings;