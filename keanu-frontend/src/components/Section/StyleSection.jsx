import {useEffect, useRef, useState} from "react";
import {Slider, Sketch, Material, Colorful, Compact, Circle, Wheel, Block, Github, Chrome} from '@uiw/react-color';
import {top250} from "/src/utils/font";
import {useAppDispatch} from "../../redux/hooks.js";
import {getPillIcon, getTagType} from "../../assets/icons/tag.jsx";
import MDEditor from "../MDEditor";
import {useParams} from "react-router-dom";
import {load, save} from "/src/utils/storageOperation.js";
import {getFileByUrl} from "../../utils/dexie/operation.js";
import {genImagePreviewURL} from "../../utils/fileOperation.js";
import AvatarImage from "/src/components/AvatarImage";

const HelperPreload = async (data) => {
    const currFont = top250[data]
    const loaded = await currFont.load()
    const {fontFamily} = loaded.loadFont();
    return fontFamily;
}

export default function StyleSection() {
    const [style, setStyle] = useState({});
    //const [hex, setHex] = useState((editData != null) ? ('style' in editData) ? editData.style.bgColor : "#fff" : "#fff");
    const [hex, setHex] = useState("#fff");
    const [currStatus, setCurrStatus] = useState("");
    //const [textHex, setTextHex] = useState((editData != null) ? ('style' in editData) ? editData.style.contentColor : "#2FA349" : "#2FA349");
    const [textHex, setTextHex] = useState("#2FA349");
    //const [titleHex, setTitleHex] = useState((editData != null) ? ('style' in editData) ? editData.style.titleColor : "#2FA349" : "#2FA349");
    const [titleHex, setTitleHex] = useState("#2FA349");
    const [titleHexStatus, setTitleHexStatus] = useState(false);
    const [titleFontStatus, setTitleFontStatus] = useState(false);
    const [colPickerVis, setColPickerVis] = useState(false);
    //const [fontTitle, setFontTitle] = useState((editData != null) ? ('style' in editData) ? (editData.style.titleFont !== undefined) && HelperPreload(fontFindHelper(editData.style.titleFont)) : null : null);
    const [fontTitle, setFontTitle] = useState(null);
    const [fontContent, setFontContent] = useState(null);
    const [fontComment, setFontComment] = useState(null);
    const [coverImgPreviewURL, setCoverImgPreviewURL] = useState(null);

    const dispatch = useAppDispatch();

    const {uuid} = useParams();
    const {username} = JSON.parse(localStorage.getItem('user'))
    const saveValue = (key, value) => save(uuid, key, value);
    const loadValue = key => load(uuid, key);

    const setCurrentFontTitle = async (data) => {
        const currFont = top250[data]
        const loaded = await currFont.load()
        const {fontFamily} = loaded.loadFont();
        setFontTitle(fontFamily)
    }

    const init = async () => {
        const {url} = loadValue("topbanner")[0];
        if (url) {
            const file = await getFileByUrl(url);
            setCoverImgPreviewURL(genImagePreviewURL(file));
        }
        const init_style = loadValue("style") ?? {};
        setStyle(init_style);
    }


    useEffect(() => {
        init();        
    }, [])
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!ref.current?.contains(event.target))
                setColPickerVis(false);
        };
        if(colPickerVis)
            document.addEventListener("pointerdown", handleClickOutside);
    }, [ref,colPickerVis]);



    const renderBackgroundColorSelector = () => {
        return (
            <div className="py-2">
                <div className="w-full justify-center flex items-center gap-3">
                    <h3
                        className={`w-auto gap-3 flex items-center justify-center text-md font-semibold  no-underline text-black cursor-pointer ${currStatus === 'Background Color' ? 'bg-gray-300' : 'bg-white'} `}>
                        Background Color
                    </h3>
                    <span 
                    onClick={() => {
                        setColPickerVis(!colPickerVis)
                    }}
                    className="w-8 h-8 cursor-pointer border border-slate-300 rounded-md" 
                    style={{backgroundColor: `${hex}`}}>

                    </span>
                </div>
                {
                    (colPickerVis) &&
                    <div className="flex items-center justify-center py-2">
                        <Sketch ref = {ref}
                            style={{marginLeft: 0}}
                            color={hex}
                            onChange={(color) => {                                
                                setHex(prev => (color.hex));

                            }}
                        />
                    </div>
                }
            </div>
        )
    }

    const renderTitleColorSelector = () => {
        return (
            <div className="py-2">
                <div className="w-full justify-center flex items-center gap-3">
                    <h3
                        className={`w-auto gap-3 flex items-center justify-center text-md font-semibold  no-underline text-black cursor-pointer ${currStatus === 'Background Color' ? 'bg-gray-300' : 'bg-white'} `}>
                        Title Color
                    </h3>
                    <span 
                    onClick={() => {
                        (titleHexStatus === false) ? setTitleHexStatus(true) : setTitleHexStatus(false)
                    }}
                    className="w-8 h-8 cursor-pointer border border-slate-300 rounded-md" 
                    style={{backgroundColor: `${titleHex}`}}>

                    </span>
                </div>
                {
                    (titleHexStatus)
                    &&
                    <div className="flex items-center justify-center py-2">
                        <Sketch
                            style={{marginLeft: 0}}
                            color={titleHex}
                            onChange={(color) => {
                                
                                setTitleHex(prev => (color.hex));
                            }}
                        />
                    </div>
                }
            </div>
        );
    }



    const renderTitleFontSelector = () => {
        return (
            <div className="py-2">
                <h3 onClick={() => {
                    (titleFontStatus === false) ? setTitleFontStatus(true) : setTitleFontStatus(false)
                }}
                    className={`w-full gap-3 flex items-center justify-center text-md font-semibold  no-underline text-black cursor-pointer ${currStatus === 'Background Color' ? 'bg-gray-300' : 'bg-white'} `}>
                    Title Font:
                    <p>{fontTitle}</p>
                </h3>
                <div className="flex items-center justify-center w-full">
                    {
                        (titleFontStatus)
                        &&
                        <div id="dropdown"
                             className="w-3/4 h-72 overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow">
                            {
                                Object.keys(top250).map((fonts) => {
                                    return (
                                        <span key={fonts} onClick={() => {
                                            setCurrentFontTitle(fonts);
                                        // , setStyleProperties(prev => ({
                                        //         ...prev,
                                        //         titleFont: top250[fonts]
                                        //     }))
                                        }}
                                              className="block px-4 py-2 hover:bg-gray-100 text-black no-underline bg-white cursor-pointer">{top250[fonts].family}</span>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg flex w-full">
                {/* <div className="flex flex-col w-1/3 items-center">
                    <label className="font-semibold text-2xl">
                        Select Style
                    </label>
                    <div className="w-full flex items-start justify-center pt-4 rounded-lg">
                        <div className="w-full flex flex-col">

                            {renderBackgroundColorSelector()}
                            {renderTitleColorSelector()}
                            {renderTitleFontSelector()}
                        </div>

                    </div>
                </div> */}
                <div className="w-full">
                    <div className="w-full flex flex-col items-center justify-center py-3"
                         style={{backgroundColor: `${hex}`}}>
                        <div className="w-full flex items-center justify-center px-4">
                            <div className="w-2/4 flex flex-col items-start pl-5">
                                <div className="flex gap-3">
                                    <AvatarImage/>
                                    <h1 className="font-thin text-lg">{username}</h1>
                                </div>
                                <h1 className="font-semibold py-2"
                                    style={{color: `${titleHex}`, fontFamily: `${fontTitle}`}}>{loadValue('title')}
                                </h1>
                            </div>
                            <div className="w-3/4 py-4">
                                {
                                    coverImgPreviewURL
                                    && <img className="w-full h-full object-fit rounded-lg" src={coverImgPreviewURL} alt="cover"/>
                                }
                            </div>
                            
                            
                        </div>
                        <div className="w-full flex gap-5 py-5">
                            <div className="flex flex-col w-3/4 items-center">
                                <MDEditor editorState={loadValue('content')} clear={true} editable={false}/>
                            </div>
                            <div className="flex flex-col w-1/4 items-center gap-5">
                                {
                                    (loadValue('tags')?.length !== 0)
                                    &&
                                    <div className="flex flex-col gap-3 w-full">
                                        <h3 className="font-semibold">
                                            Tags:
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3 px-2">
                                            {loadValue('tags')?.map((result) => {
                                                return (
                                                    <div className="w-auto flex border rounded-md">                                                    
                                                        {getTagType(result)}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                } 
                                {
                                    (loadValue('resourceTypes')?.length != 0)
                                    &&
                                    <div className="flex flex-col gap-3 w-full">
                                        <h3 className="font-semibold">
                                            Types:
                                        </h3>
                                        <div className="flex gap-3 px-2">
                                            {
                                                loadValue('resourceTypes')?.map((result)=>{
                                                    return(
                                                        <div>
                                                            {getPillIcon(result)}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>


                                }                                                                                               
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-center justify-center">
                            <h1 className="font-semibold py-2">Comments</h1>
                            <div className="flex gap-3 underline">
                                <p className="font-semibold"
                                    style={{fontFamily: `${fontComment}`, color: `${textHex}`}}>User:</p>
                                <p style={{fontFamily: `${fontComment}`, color: `${textHex}`}}>A good project !
                                    Expecting for more updates !</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}