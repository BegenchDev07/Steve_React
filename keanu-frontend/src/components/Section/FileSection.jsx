import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.js";
import {FILE_UPLOAD_MODE, FileUpload} from "../../components/FileUpload";
import MDEditor from "../MDEditor";
import {getPillIcon} from "../../assets/icons/tag";
import {useParams, useLocation} from "react-router-dom";
import {db} from "../../utils/dexie/db";
import {$blob2Img} from "../../utils/reader.js";
import {load, save} from "../../utils/storageOperation.js";
import {
    checkFileByUrl,
    deleteFileByUrl,
    deleteFileStartsWith,
    fetchFileFromLocal,
    listFiles
} from "../../utils/dexie/operation.js";
import {getImage, genImagePreviewURL} from "../../utils/fileOperation.js";
import {$base64ToFileBlob, $checkPreviewImage, $clipImage, $readPath} from "../../utils/reader.js";

const COVER_MAX_SIZE = 800;
const resizeImg = fileArr => Promise.all(fileArr.map((file, index) => {
    const {type, name, size} = file;
    if ($checkPreviewImage(type))
        return $blob2Img(file)
            .then(img => {
                const max = Math.max(img.width, img.height);
                if (max < COVER_MAX_SIZE)
                    return Promise.resolve(file);
                else {
                    const scale = Math.max(1, Math.round(max / COVER_MAX_SIZE));
                    const base64 = $clipImage(img, img.width / scale, img.height / scale)
                    console.log(img.height / scale);
                    return $base64ToFileBlob(base64, name, type)
                    .then((blob)=>{
                         $blob2Img(blob).then(img=>console.log('img',img.width,img.height))
                         return Promise.resolve(blob);
                    })
                        
                }

            })
    else
        return Promise.resolve(file);
}));

const removeDBIndex = async (fileArr, flag, uploadPath, uuid) => {
    const storageList = await listFiles(`${uploadPath}/${uuid}/${flag}`)
        .then(res => res.map(url => ({url, file: $readPath(url).file})));
    const removeList = storageList.filter(({file}) => !fileArr.find(ele => ele.name === file));
    await Promise.all(removeList.map(({url}) => deleteFileByUrl(url)));
}

const resizeSaveImg = (fileArr, urlPrefix) => {
    return resizeImg(fileArr)
        .then(clippedArr => Promise.all(clippedArr.map((file) => {
            const url = `${urlPrefix}/${file.name}`;
            return db.images.put({url, file});
        }))
            .then(ids => {
                const getInfo = ids.map(
                    (url, index) => new Promise(res => {
                        const {type, size} = clippedArr[index];

                        return getImage(genImagePreviewURL(clippedArr[index]))
                            .then(({width, height}) => res({width, height, url, type, size, file: clippedArr[index]}));


                    }));
                return Promise.all(getInfo)
            }))
}

const saveFile =
    (fileArr, urlPrefix) => {
        return Promise.all(fileArr.map((file) => {
            const url = `${urlPrefix}/${file.name}`;
            return db.images.put({url, file});
        })).then(ids => {
            const info = ids.map((url, index) => ({
                url,
                type: fileArr[index].type,
                size: fileArr[index].size,
                file: fileArr[index]
            }));
            return Promise.all(info);
        })
    }

export const handleFilesChange = async (fileArr, flag, uploadPath, uuid, callback, isImgClipping = true) => {
    const urlPrefix = `${uploadPath}/${uuid}/${flag}`;
    return removeDBIndex(fileArr, flag, uploadPath, uuid)// remove the file with the same name in indexedDB
        .then(_ => {
            let job;
            if (isImgClipping)
                job = _ => resizeSaveImg(fileArr, urlPrefix)
            else {
                job = _ => saveFile(fileArr, urlPrefix)
            }
            return job().then(res => callback(res))
        });
};

export default function FileSection() {
    const currentUserName = useAppSelector((state) => state.auth.user.username);
    const {uuid} = useParams();
    const loadValue = key => load(uuid, key);
    const saveValue = (key, value) => save(uuid, key, value);

    const [fileList, setFileList] = useState({cover: [], topbanner: []});

    const getTheUsername = () => {
        const {user} = useAppSelector((state) => state.auth);
        return user.username;
    }

    useEffect(() => {
        const coverURL = loadValue('cover')?.url;
        const topbannerURL = loadValue('topbanner')?.url;

        let loadList = [];
        if(coverURL)
           loadList.push(coverURL);
        if(topbannerURL)
            loadList.push(topbannerURL);


        fetchFileFromLocal(loadList)
            .then(result => {
                const cover = (result.find(({url, file})=>url===coverURL)??{file:null})['file'];
                const topbanner = (result.find(({url, file})=>url===topbannerURL)??{file:null})['file'];
                const list = {cover:cover?[cover]:[], topbanner:topbanner?[topbanner]:[]};

                setFileList(list);
            });
    }, []);

    const renderCoverArea = () => {
        return (
            <div className="bg-white rounded-md py-3 px-3">
                <label className="font-semibold text-2xl">
                    Upload Cover Image
                </label>
                <div className="w-full h-1/2">
                    <FileUpload mode={FILE_UPLOAD_MODE.single}
                                onFilesChange={newFiles => handleFilesChange(newFiles, 'cover', `${currentUserName}/.profile`, uuid,
                                    (files) => {
                                        saveValue('cover', files.map(ele => ({...ele, file: undefined}))[0]);
                                        setFileList(prevState => ({
                                            ...prevState,
                                            cover: files.map(ele => ele.file)
                                        }));
                                    }
                                )}
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
                                onFilesChange={(newFiles) =>
                                    handleFilesChange(newFiles, 'topbanner', `${currentUserName}/.profile`, uuid,
                                        (files) => {
                                            saveValue('topbanner', files.map(ele => ({...ele, file: undefined}))[0]);
                                            setFileList(prevState => ({
                                                ...prevState,
                                                topbanner: files.map(ele => ele.file)
                                            }));
                                        }
                                    )}
                                fileType={'image/*'}
                                initFiles={fileList['topbanner']}/>
                </div>
            </div>
        )
    }

    const renderContentArea = () => {
        return (
            <div className="h-auto flex flex-col gap-4 bg-white rounded-md py-1 px-3 min-h-96">
                <h1 className="font-semibold">Content</h1>
                <MDEditor editorState={loadValue('content')} project={null}
                          uploadPath={`${getTheUsername()}/.profile`}
                          clear={false}
                          onSave={lexicalData => saveValue('content', lexicalData)}
                          editable={true}/>
            </div>
        )
    }

    return (
        <div className="flex flex-col top-20 w-full justify-center items-start bg-white rounded-lg">
            <div className="pb-5 w-full h-auto gap-2 px-4">
                {renderCoverArea()}
                {renderTopBannerArea()}
                {renderContentArea()}
            </div>
        </div>
    )
}