import {Fragment, useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "/src/redux/hooks";
import MDEditor from "../MDEditor";
import {createAlert} from "/src/redux/reducers/AlertSlice";
import {getTagType} from "/src/assets/icons/tag";
import {useParams} from "react-router-dom";
import {load, save} from "../../utils/storageOperation.js";
import {apiCatcher} from "../../utils/apiChecker.js";
import {getHotTags} from "../../services/API/tags/index.js";
import {$merge} from "../../utils/arrayOperation.js";

export default function ContextSection() {
    const dispatch = useAppDispatch();
    const defaultTags = ['SAI', '2D', 'Detective', 'Brainstorm', 'GameHub'];
    // we provide some tags by default, but the user can also add custom tags
    const [providedTags, setProvidedTags] = useState(defaultTags);
    const {uuid} = useParams();
    const customTagInputRef = useRef(null);
    const loadValue = key => load(uuid, key);
    const [selectedTags, setSelectedTags] = useState(loadValue('tags') || []);

    // const getTheUsername = () => {
    //     const {user} = useAppSelector((state) => state.auth);
    //     return user.username;
    // }

    const handleChange = (evt, type = 'title') =>  save(uuid,type , evt.target.value);

    const handleNewCustomTags = (e) => {
        // we grab it from event        
        if (selectedTags.length < 5 && !selectedTags.includes(e.currentTarget.value)) {
            const nowTags = [...selectedTags, e.currentTarget.value];            
            setSelectedTags(nowTags);
            save(uuid, 'tags', nowTags);
        } else {
            dispatch(createAlert({
                type: 'error',
                message: `you can only select 5 tags`,
            }))
        }
    }

    const handleSelectNewTags = () => {
        //we grab it from ref.current.value
        if (selectedTags.length < 5 && !selectedTags.includes(customTagInputRef.current.value)) {
            const nowTags = [...selectedTags, customTagInputRef.current.value];            
            setSelectedTags(nowTags);
            save(uuid, 'tags', nowTags);
        } else {
            // todo: need to show different error message
            if(selectedTags.length >= 5){
                dispatch(createAlert({
                    type: 'error',
                    message: `you can only select 5 tags`,
                }))
            }
            if(selectedTags.includes(customTagInputRef.current.value)){
                dispatch(createAlert({
                    type: 'error',
                    message: `tag already exists`,
                }))
            }
        }
    }

    const handleRemoveTag = (data) => {
        const filteredTags = selectedTags.filter(tag => tag !== data);
        setSelectedTags(filteredTags);
        save(uuid, 'tags', filteredTags);
    }

    const fetchHotTags = _ => apiCatcher(dispatch, getHotTags, 5)
        .then(res => {
            let providedTags = defaultTags;
            // check the res
            if(res.length<5){
                providedTags = $merge(res,providedTags);
            }
            setProvidedTags(providedTags);
        });

    useEffect(() => {
        fetchHotTags();
    }, [])

    const renderTitleArea = () => {
        return (
            <div className="flex w-1/2 items-start">
                <div className="flex gap-2 w-full">
                    <label className="font-semibold text-2xl">
                        Title:
                    </label>
                    <input defaultValue={loadValue('title')} onChange={evt=>handleChange(evt, 'title')} type="text" name="title" id=""
                           className="w-full hover:outline focus:outline px-2 py-0.5" placeholder="Enter the name"
                           required/>
                </div>
            </div>
        );
    }

    const renderDescriptionArea = ()=>{
        return (<div className="flex flex-col gap-2">
            <div
                className="flex w-full flex-col gap-2 items-start bg-white rounded-md py-3 px-3">
                <label className="font-semibold text-2xl">
                    Description
                </label>
                <textarea
                    defaultValue={loadValue('description')} onChange={evt=>handleChange(evt, 'description')}
                    className="px-2 py-2 border rounded-md w-full" rows={5}/>
            </div>
        </div>)
    }

    const renderTagsArea = () => {
        return (
            <div className="flex gap-2 w-1/2 px-2">
                <div className="flex flex-col gap-4 w-1/2">
                    <div className="flex gap-2">
                        <label className="font-semibold text-2xl">
                            Tags:
                        </label>
                        <input type="text" name="title" ref={customTagInputRef}
                               className="w-full hover:outline focus:outline px-2 py-0.5" placeholder="Enter the tag"/>
                        <a onClick={handleSelectNewTags}
                           className="border bg-blue-600 text-white rounded-md px-1 pt-1 text-center no-underline cursor-pointer">
                            add
                        </a>
                    </div>
                    <select
                        className="pt-2 w-full"
                        name="selectTags"
                        multiple={true}
                    >
                        {
                            providedTags?.map((ele, index) => {
                                return (
                                    <Fragment key={index}>
                                        <option key={index} onClick={handleNewCustomTags} value={ele}>{ele}</option>
                                    </Fragment>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="flex w-1/2 justify-center px-2">
                    {
                        (selectedTags?.length != 0) &&
                        <div className="grid grid-cols-2 gap-1 justify-items-center self-center">
                            {selectedTags?.map((ele, index) => {
                                return (
                                    <Fragment key={index}>
                                        <span id={index} onClick={() => {
                                            handleRemoveTag(ele)
                                        }}>
                                        <svg className=" -top-2 -left-1.5 icon cursor-pointer" viewBox="0 0 1024 1024"
                                            version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2792" width="10" height="10"><path
                                            d="M512 455.431L794.843 172.59a8 8 0 0 1 11.313 0l45.255 45.255a8 8 0 0 1 0 11.313L568.57 512 851.41 794.843a8 8 0 0 1 0 11.313l-45.255 45.255a8 8 0 0 1-11.313 0L512 568.57 229.157 851.41a8 8 0 0 1-11.313 0l-45.255-45.255a8 8 0 0 1 0-11.313L455.43 512 172.59 229.157a8 8 0 0 1 0-11.313l45.255-45.255a8 8 0 0 1 11.313 0L512 455.43z"
                                            p-id="2793" fill="#515151"></path></svg>
                                            {getTagType(ele)}
                                        </span>
                                    </Fragment>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="flex w-full flex-col top-20 h-auto bg-white rounded-lg">
                <div className="pb-5">
                    <div className="flex flex-col gap-2 px-4">
                        <div className="flex flex-col gap-2 pt-3">
                            <div className="flex flex-col gap-4 bg-white rounded-md py-3 px-3">
                                <div className="w-full flex">
                                    {renderTitleArea()}
                                    {renderTagsArea()}                                
                                </div>
                                <div className="w-full">
                                    {renderDescriptionArea()}
                                </div>
                            </div>
                          </div>
                    </div>
                </div>
            </div>
        </>
    )
}
