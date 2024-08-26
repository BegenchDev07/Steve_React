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

export default function ProjectSection() {
    const dispatch = useAppDispatch();
    const defaultTags = ['SAI', '2D', 'Detective', 'Brainstorm', 'GameHub'];
    // we provide some tags by default, but the user can also add custom tags
    const [providedTags, setProvidedTags] = useState(defaultTags);
    const [confirmState, setConfirmState] = useState(false);
    const [checkState, setCheckState] = useState(false);
    const {uuid} = useParams();
    const customTagInputRef = useRef(null);
    const loadValue = key => load(uuid, key);
    const [selectedTags, setSelectedTags] = useState(loadValue('tags') || []);
    const [privateState, setPrivateState] = useState(loadValue('isPrivate') ? true : false);

    const handleChange = (evt, type = 'title') => { 

        switch (type) {
            case 'isPrivate':
                setPrivateState(!privateState)
                save(uuid,type , evt.target.value||evt.target.checked);
                break;
            case 'name':
                if((/^[a-zA-Z0-9_.]*$/.test(evt.target.value))){  
                    setCheckState(false);                                      
                    save(uuid,type , evt.target.value||evt.target.checked);
                }
                else {                    
                    setCheckState(true);
                }
                break;
            default:
                save(uuid,type , evt.target.value||evt.target.checked);
        }


        // if(type === 'isPrivate')
        //     setPrivateState(!privateState)

        // if(type === 'name')
        //     if(/^[a-zA-Z0-9_.]*$/.test(event.target.value))

        // save(uuid,type , evt.target.value||evt.target.checked);
    }

    const handleNewCustomTags = (e) => {
        // we grab it from event        
        if (selectedTags.length < 5 && !selectedTags.includes(e.currentTarget.value)) {
            const nowTags = [...selectedTags, e.currentTarget.value];            
            setSelectedTags(nowTags);
            save(uuid, 'tags', nowTags);
        } else {
            dispatch(createAlert({
                type: 'error',
                message: `you can only select 5 tags and don't duplicate tags`,
            }))
        }
    }

    const handleSelectNewTags = () => {
        //we grab it from ref.current.value        
        if(/.*\S.*/.test(customTagInputRef.current.value)){
            if (selectedTags.length < 5 && !selectedTags.includes(customTagInputRef.current.value)) {
                const nowTags = [...selectedTags, customTagInputRef.current.value];            
                setSelectedTags(nowTags);
                save(uuid, 'tags', nowTags);
            } else {
                dispatch(createAlert({
                    type: 'error',
                    message: `you can only select 5 tags and can't select same tag twice`,
                }))
            }
        } else {            
            dispatch(createAlert({
                type: 'error',
                message: `tags can't be empty`
            }))
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

    const renderProjectArea = () => {
        return (
            <div className="flex w-3/4 items-start">
                <div className="flex flex-col gap-2 w-full items-center justify-center">
                    <div className="w-full flex gap-2">
                        <label className="w-1/7 font-semibold text-xl">
                            Name:
                        </label>
                        <input defaultValue={loadValue('name')} onChange={evt=>handleChange(evt, 'name')} type="text" id=""
                            className="w-full hover:outline focus:outline px-2 py-0.5" placeholder="Enter the name"
                            required/>                        
                    </div>
                    {       
                        (confirmState)
                        &&                 
                        <p className="w-full text-start font-semibold text-red-600">This name is already occupied</p>
                    }
                    {       
                        (checkState)
                        &&                 
                        <p className="w-full text-start font-semibold text-red-600">Project name can only contains 0-9 a-z  "." and "_"</p>
                    }
                    {/* <div className="w-full flex items-start">
                        <button
                        onClick={()=>{setConfirmState(true)}}
                        className="w-auto text-lg px-2 py-1 text-white rounded-md bg-blue-500">
                            Confirm
                        </button>
                    </div> */}
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
                        <input type="text" ref={customTagInputRef}
                               className="w-full hover:outline focus:outline px-2 py-0.5" placeholder="Enter the tag"/>
                        <a onClick={handleSelectNewTags}
                           className="border bg-blue-600 text-white rounded-md px-1 pt-1 text-center no-underline cursor-pointer">
                            add
                        </a>
                    </div>
                    <select
                        className="pt-2 w-full"
                        multiple={true}
                    >
                        {
                            providedTags?.map((ele, index) => {
                                return (
                                    <option key={index} onClick={handleNewCustomTags} value={ele}>{ele}</option>
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
                                    <>
                    <span id={index} onClick={() => {
                        handleRemoveTag(ele)
                    }}>
                      <svg className=" -top-2 -left-1.5 icon cursor-pointer" viewBox="0 0 1024 1024"
                           version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2792" width="10" height="10"><path
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
            </div>
        );
    }

    const renderToggleArea = () => {                
        return(
            <>
                <span className="font-semibold text-2xl">Privacy:</span>
                <label className="inline-flex items-center cursor-pointer">
                <span className="me-3 text-md font-semibold text-gray-900">{privateState ? 'On' : 'Off'}</span>
                <input type="checkbox" value="" className="sr-only peer"
                       defaultChecked={loadValue('isPrivate')}
                       onChange={evt=> handleChange(evt, 'isPrivate')}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                </label>
            </>
        )
    }


    return (
        <>
            <div className="flex w-full flex-col top-20 h-auto bg-white rounded-lg">
                <div className="pb-5">
                    <div className="flex flex-col gap-2 px-4">
                        <div className="flex flex-col gap-2 pt-3">
                            <div className="w-full flex flex-col gap-5 py-3 px-3">
                                {renderProjectArea()}
                            </div>                            
                            <div className="flex flex-col gap-4 bg-white rounded-md py-3 px-3">
                                    {renderToggleArea()}
                                    {renderTagsArea()}                                
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
