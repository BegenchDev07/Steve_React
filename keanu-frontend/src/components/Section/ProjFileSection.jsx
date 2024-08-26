import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "/src/redux/hooks";
import {FILE_UPLOAD_MODE, FileUpload} from "/src/components/FileUpload";
import MDEditor from "../MDEditor";
import {getPillIcon} from "/src/assets/icons/tag";
import {useParams, useLocation} from "react-router-dom";
import {db} from "/src/utils/dexie/db";
import {load, save} from "/src/utils/storageOperation.js";
import {
    deleteFileByUrl,
    fetchFileFromLocal,
    listFiles
} from "../../utils/dexie/operation.js";
import {getImage, genImagePreviewURL} from "../../utils/fileOperation.js";
import {$checkPreviewImage, $readPath} from "../../utils/reader.js";

export default function ProjFileSection() {
    const currentUserName = useAppSelector((state) => state.auth.user.username);
    const uploadPath = `${currentUserName}/.profile`;
    const {uuid} = useParams();
    const {pathname} = useLocation();
    const dispatch = useAppDispatch();
    const [resourceFlag, setResourceFlag] = useState(null);
    const [projectFlag, setProjectFlag] = useState(null);
    const loadValue = key => load(uuid, key);
    const saveValue = (key, value) => save(uuid, key, value);

    const [fileList, setFileList] = useState({resource: [], cover: [], topbanner: []});

    

    const [dropdownStatus, setDropdownStatus] = useState(false);
    const availableChoices = ['Illustrator', 'Photoshop', 'Aseprite', 'CSP', 'SAI'];
    const [currentChoice, setCurrentChoice] = useState([]);

    const handleSelectChoice = (data) => {
        const nowChoicesSet = new Set([...currentChoice, data]),
            nowChoices = Array.from(nowChoicesSet);
        setCurrentChoice(nowChoices);
        saveValue('resourceTypes', nowChoices);
    }


    const getTheUsername = () => {
        const {user} = useAppSelector((state) => state.auth);
        return user.username;
    }


    const removeDBIndex = async (fileArr, flag)=>{
        const storageList = await listFiles(`${uploadPath}/${uuid}/${flag}`)
            .then(res => res.map(url => ({url, file: $readPath(url).file})));
        const removeList = storageList.filter(({file}) => !fileArr.find(ele => ele.name === file));
        await Promise.all(removeList.map(({url}) => deleteFileByUrl(url)));
    }

    const handleFilesChange = async (fileArr, flag) => {
        return removeDBIndex(fileArr, flag)
            .then(_=>Promise.all(fileArr.map((file) => {
                const url = `${uploadPath}/${uuid}/${flag}/${file.name}`;
                return db.images.put({url, file});})))

            .then(ids=>{
                const getInfo = ids.map(
                    (url, index) => new Promise(res => {
                        const {type,size} = fileArr[index];
                        if($checkPreviewImage(type)){
                            return getImage(genImagePreviewURL(fileArr[index]))
                                .then(({width, height}) => res({width, height, url, type,size}));
                        }else
                            return res(({url, type,size}))

                    }));


                return Promise.all(getInfo);
            })

            .then(info=>{

                saveValue(flag, info);

                setFileList(prevState => ({
                    ...prevState,
                    [flag]: fileArr
                }));

            }).catch(err=>{
                debugger;
            })



    };

    useEffect(() => {
        if(pathname.split('/').filter(ele => ele).includes('product')){            
            setResourceFlag(true);
        }
        if(pathname.split('/').filter(ele => ele).includes('project')){
            setProjectFlag(true);
        }
        const cover = loadValue('cover');
        const topbanner = loadValue('topbanner');
        const loadList = [
            ...cover.flat().map(({url})=>url),
            ...topbanner.flat().map(({url})=>url),
        ]
        fetchFileFromLocal(loadList)
            .then(result => {
                const list = {cover:[],topbanner:[]};
                result.forEach(({url,file})=>{
                    if(cover.find(ele=>ele.url === url))
                        list.cover.push(file);

                    if(topbanner.find(ele=>ele.url === url))
                        list.topbanner.push(file);
                })
                setFileList(list);
            });
    }, []);

    const renderResourceArea = _ => {        
        if(resourceFlag)        
            return (
                <div className="bg-white rounded-md py-3 px-3">
                    <div className="flex items-center gap-3">
                        <label className="font-semibold text-2xl">
                            Resources:
                        </label>                        
                        <div className="w-auto flex gap-3 items-center justify-center">
                            {
                                (loadValue('resourceTypes') != null)
                                &&
                                Object.values(loadValue('resourceTypes')).map((result, index) => {
                                    return (
                                        <span key={index}>
                                {
                                    getPillIcon(result)
                                }
                                </span>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div id="uploadComponent" className="w-auto h-18">
                        <div className="flex flex-col w-auto items-center justify-start gap-3 py-2">
                            <button onClick={() => {
                                (dropdownStatus === false) ? setDropdownStatus(true) : setDropdownStatus(false)
                            }} id="dropdownHoverButton" data-dropdown-toggle="dropdownHover"
                                    className="text-dark bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                                    type="button">
                                <p className="text-white">Pick the type</p>
                                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="white" strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                </svg>
                            </button>
                            {
                                (dropdownStatus)
                                &&
                                <div id="dropdownHover"
                                     className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownHoverButton">
                                        {
                                            availableChoices.map((result, index) => {
                                                return (
                                                    <li key={index} onClick={() => {
                                                        handleSelectChoice(result);
                                                        setDropdownStatus(false)
                                                    }}>
                                                        <p className="block px-4 py-2 hover:bg-gray-100 no-underline text-black">{result}</p>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            }

                        </div>
                        <FileUpload mode={FILE_UPLOAD_MODE.multiple}
                                    onFilesChange={newFiles => handleFilesChange(newFiles, 'resource')}
                                    initFiles={fileList['resource']}/>
                    </div>
                </div>
            );
        else
            return (
                <></>
            )
    }


    const renderCoverArea = () => {
        return (
                <div className="bg-white rounded-md py-3 px-3">
                    <label className="font-semibold text-2xl">
                        Upload Cover Image
                    </label>
                    <div className="w-full h-1/2">
                        <FileUpload mode={FILE_UPLOAD_MODE.single}
                                    onFilesChange={newFiles => handleFilesChange(newFiles, 'cover')}
                                    fileType={'image/*'}
                                    initFiles={fileList['cover']}/>
                    </div>
                </div>
        )
    }

    const renderTopBannerArea = () => {
        return (
            <div className="bg-white rounded-md py-3 px-3">
                <label className="font-semibold text-2xl">
                    Upload TopBanner
                </label>
                <div className="w-full h-18">
                    <FileUpload mode={FILE_UPLOAD_MODE.single}
                                onFilesChange={(newFiles) => handleFilesChange(newFiles, 'topbanner')}
                                fileType={'image/*'}
                                initFiles={fileList['topbanner']}/>
                </div>
            </div>
        )
    }


    return (
        <div className="flex flex-col top-20 w-full justify-center items-start bg-white rounded-lg">
            <div className="pb-5 w-full h-auto gap-2 px-4">

                {
                    (resourceFlag != null)
                    &&
                    renderResourceArea()
                }
                {
                    (projectFlag === null)
                    ?      
                    <>
                    {renderCoverArea()}
                    {renderTopBannerArea()}
                    </>
                    :
                    renderCoverArea()
                    
                }
                                

                <div className="h-auto flex flex-col gap-4 bg-white rounded-md py-1 px-3 min-h-96">
                <h1 className="font-semibold">Content</h1>                
                    <MDEditor editorState={loadValue('content')} project={null}
                                                  uploadPath={`${getTheUsername()}/.profile`}
                                                  clear={false}
                                                  onSave={lexicalData => saveValue('content', lexicalData)}
                                                  editable={true}/>                
                </div>
            </div>
        </div>
    )

}