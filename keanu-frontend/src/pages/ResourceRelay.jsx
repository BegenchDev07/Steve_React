import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {$assert, $exeSequential, $genUploadingArr, fetchIndexJson, genUUID, getS3} from "../utils/reader";
import {useAppDispatch, useAppSelector} from "../redux/hooks.js";
import {useForm} from "react-hook-form";
import {apiCatcher} from "../utils/apiChecker";
import {createPost, createProduct, createProject, updateProduct, updatePost, getResource} from "../services/API/resource";
import {
    checkObjectArray,
    getObjectArrayState,
    load,
    removeObjectArray,
    save,
    saveObjectArray
} from "../utils/storageOperation.js";
import {fetchFileFromLocal} from "../utils/dexie/operation.js";
import {s3Catcher} from "../utils/apiChecker.js";
import { UpsertPost,UpsertProduct,UpsertProject } from "../components/Upsert";
import {db} from "../utils/dexie/db";
import {MENU_LOADING_PROGRESS} from "../redux/constants/menuConstants";
import "driver.js/dist/driver.css";
import TermsConditions from "../components/TermsConditions";
import mime from 'mime';

const MODE = {consent: 1, loading: 2, ready: 4, uploading: 8}

export default function ResourceRelay() {
    const [mode, setMode] = useState(null);
    const [uuid, setUUID] = useState(useParams().uuid);
    const location = useLocation();
    const currentUserName = useAppSelector((state) => state.auth)?.user?.username;
    const s3 = getS3();
    const navigator = useNavigate();
    const type = location.pathname.split('/').at(1); // post  product or project
    const loadValue = key => load(uuid, key);
    const dispatch = useAppDispatch();
    const [updateState, setUpdateState] = useState(false);
    const [productData, setProductData] = useState(null);
    const generatedUUIDRef = useRef('');
    // const proj_username = useParams();
    // debugger;

    // fetch the data from the server
    // we should consider the case where there are two conflict data between the local and the server

    const fetchData = (type) => {
        // debugger;
        return apiCatcher(dispatch, getResource, uuid, type)        
    } 

    const fetchAndSave = async () => {        
        const dbData = await fetchData(type);
        const s3JSON = await fetchIndexJson(s3, currentUserName, uuid);

        $assert(s3JSON&&s3JSON.content);

        debugger;

        const content = s3JSON.content;
        const tag = dbData.resource_tag.map(({tag})=>tag.name); 
        if (!tag.includes(type))
            tag.push(type);

        // debugger;
        const title = dbData.title; 
        const {cover, topbanner} = dbData;
        const media = {cover, topbanner};
        const description = dbData.description;  
        // productData
        save(uuid, 'title', title);
        save(uuid, 'tags', tag);
        save(uuid, 'description', description);
        save(uuid, 'content', content);
        save(uuid, 'cover', cover);
        save(uuid, 'topbanner', topbanner);
        // debugger


        // download the productItems
        const _fetchSave = (url => {
            return s3Catcher(dispatch, 'downloadProfile', url)
                .then(blob => {
                    // debugger;
                    const fileName = url.substring(url.lastIndexOf('/') + 1);
                    const fileExtName = url.split('.').pop();
                    //https://groups.google.com/g/weinre/c/FyTSsScUDBI?pli=1
                    //mime.lookup() is removed and changed to mime.getType()
                    const fileType = mime.getType(fileExtName);
                    const res = new Blob([blob], {type: fileType},{name: fileName});
                    const file = new File([blob], fileName, { type: fileType });
                    //db.images.put({url, file: res})
                    db.images.put({url, file: file})
                });
        })

        if(type === 'product'){
            const productItems = dbData.product_item;
            const downloadList = Object.values(media).map(({url})=>url)
            // debugger;
            save(uuid, 'productItems', productItems);
            // debugger;
            productItems.forEach((productItem)=>{
                // productItem.cover.forEach(({url})=>downloadList.push(url));
                downloadList.push(productItem.cover.url);
                productItem.download.files.forEach(({url})=>downloadList.push(url));
            });
            return $exeSequential(_fetchSave, downloadList);
        }


    }

    const {handleSubmit} = useForm()

    const postS3 = async (submitData)=>{
        submitData['title'] = loadValue('title');
        submitData['tags'] = loadValue('tags') ?? [];
        submitData['description'] = loadValue('description');
        submitData['content'] = loadValue('content') ?? '';
        // submitData['resourceTypes'] = loadValue('resourceTypes') ?? [];
    }

    const productS3 = async (submitData)=>{
        submitData['title'] = loadValue('title');
        submitData['tags'] = loadValue('tags') ?? [];
        submitData['description'] = loadValue('description');
        submitData['content'] = loadValue('content') ?? '';
        submitData['bundle_items'] = loadValue('bundle_items');
        // todo: why comment them off?
        // submitData['currency'] = loadValue('currency');
        // submitData['price'] = loadValue('price');
    }

    const projectS3 = submitData =>{
        submitData['title'] = loadValue('name');
        //submitData['is_private'] = loadValue('isPrivate')??false;
        submitData['tags'] = loadValue('tags') ?? [];
        submitData['description'] = loadValue('description');
        // submitData['coverLink'] = loadValue('cover').at(0)['url']
    }

    const upload = (submitData)=>{
        const cover = loadValue('cover'),
            topbanner = loadValue('topbanner'),
            productItems = loadValue('productItems')??[]; // for product only

        const typeArr = productItems.map(({type}) => type);
        // const nowTagsSet = new Set([...typeArr, ...submitData['tags']]);
        // submitData['tags'] = Array.from(nowTagsSet);

        const loadList = [
            cover.url,topbanner.url,
            ...productItems.map(({cover})=>cover.url).flat(),
            ...productItems.map(({download})=>download.files).flat().map(({url})=>url)
        ];

        return fetchFileFromLocal(loadList)
            .then(fileList=>{
                // if(type === 'product')
                //     submitData['productItems'] = productItems;

                const totalFileSize = Object.values(fileList).flat().reduce((acc, cur) => acc += cur.file.size, 0);
                const media = {cover,topbanner};
                submitData['totalFileSize'] = totalFileSize;
                submitData['media'] = media;

                // prepare the param for uploading
                const paramArr = $genUploadingArr(fileList,
                     loadedSize=>  dispatch({
                            type: MENU_LOADING_PROGRESS,
                            payload: {status: 'progress', progress: loadedSize / totalFileSize},
                        }),
                        path=>/index\.json/.test(path)
                    );
                paramArr.push([`${currentUserName}/.profile/${uuid}/index.json`, JSON.stringify(submitData)]);

                const dummyFnc = (...params) => s3.uploadProfile(...params);
                // const {result, errs} = checkFailure(submitData,type);

                return $exeSequential(dummyFnc, paramArr).then(_ => {
                    const state = getObjectArrayState(`${currentUserName}-resource`, uuid);
                    if (state === 'create'){
                        const {tags, title='', description='',totalFileSize='',bundle_items=[]} = submitData;
                        const data_link = `${currentUserName}/.profile/${uuid}/index.json`,
                            cover = media.cover, topbanner = media.topbanner;
                        if(type === 'post')
                            _create({type,tags,title,description,data_link,cover,topbanner,uuid,totalFileSize});
                        else if(type === 'product'){                            
                            const product_item_arr = loadValue('productItems')
                                .map(({uuid,name,type,unit_amount,discount_ratio,currency,duration, cover, download, description})=>{
                                    if(type === 'bundle'){
                                        return {uuid,name,type,discount_ratio:parseFloat(discount_ratio),currency,duration, cover, download,item_arr:bundle_items,description}
                                    } else {
                                        return {uuid,name,type,unit_amount:parseFloat(unit_amount),currency,duration, cover, download,description}
                                    }
                                }); 
                            debugger;                               
                            _create({type,tags,title,description,data_link,cover,topbanner,uuid, product_item_arr,totalFileSize});
                        }else if(type === 'project') {
                            const is_private = loadValue('isPrivate')??false;                            
                            _create({type, tags, title, description, data_link, cover,topbanner, uuid, is_private,totalFileSize});
                        }
                        navigator(`/@${currentUserName}`)
                    }
                    else if (state === 'update'){
                        const cover = media.cover;                        
                        const bundle_items = submitData['bundle_items']
                        submitData['cover'] = cover;
                        submitData['uuid'] = uuid;
                        // debugger;
                        if(type === 'product'){                            
                            // debugger;
                            const product_item_arr = loadValue('productItems')
                                .map(({uuid,name,type,unit_amount,discount_ratio,currency,duration, cover, download,description})=>{
                                    if(type === 'bundle'){
                                        debugger;
                                        return {uuid,name,type,discount_ratio:parseFloat(discount_ratio),currency,duration, cover, download,item_arr:bundle_items,description}
                                    } else {
                                        return {uuid,name,type,unit_amount:parseFloat(unit_amount),currency,duration, cover, download,description}
                                    }
                                });                        
                            submitData['product_item_arr'] = product_item_arr                            
                            debugger;
                        }
                        
                        // debugger;
                        _update(submitData);                    
                        navigator(`/@${currentUserName}`)
                    }
                });
        })
    };

    const submitHandler = handleSubmit((submitData) => {
            submitData['type'] = type;            
            if(type === 'post')
               postS3(submitData);
            else if(type === 'product')
                productS3(submitData);
            else if(type === 'project')
                projectS3(submitData);
            dispatch({
                type: MENU_LOADING_PROGRESS,
                payload: {status: 'start', progress: 0},
            });
            return upload(submitData);
      })

    const
        _stop = _ => {
            dispatch({
                type: MENU_LOADING_PROGRESS,
                payload: {status: 'stop', progress: 1},
            });
        },
        _clean = _ => {
            dispatch({
                type: MENU_LOADING_PROGRESS,
                payload: {status: 'stop', progress: 1},
            });
            // remove the current uuid from localStorage
            removeObjectArray(`${currentUserName}-resource`, uuid);
            // todo: need to remove file in indexeddb
            navigator(`/@${currentUserName}`);
        },
        _type = _=>{
            switch (type){
                case 'post':
                    return createPost;
                case 'product':
                    return createProduct;
                case 'project':
                    return createProject;
            }
        },
        _create = ( params) => apiCatcher(dispatch, _type(),  params)
            .then(_clean)
            .catch(_stop), //todo: actually, we should not clean the data if the data is not uploaded successfully

        _updateType = _ =>{
            switch (type){
                case 'post':
                    return updatePost;
                case 'product':
                    return updateProduct;                
            }
        },

        _update = (params) => {
            debugger;
            if(params.type != 'project'){
                apiCatcher(dispatch, _updateType(), params)
                .then(_clean)
                .catch(_stop);
            }
        }

    useEffect(() => {
        // todo: check if the user has already consented
        const isConsentAlready =  false; // set default to true for now
            //!!loadObjectArray(`${currentUserName}-resource`).length;
        if (!isConsentAlready)
            setMode(MODE.consent);

        if (Number(uuid) === 0) {
            // in strict mode, React will run useEffect twice,so we need to check if the uuid is generated
            // if not generate uuid yet
            if(generatedUUIDRef.current===''){
                const newUUID = genUUID();
                const item = {uuid: newUUID, type, state: 'create'};
                saveObjectArray(`${currentUserName}-resource`, item);
                generatedUUIDRef.current=newUUID;
                navigator(`/${type}/${generatedUUIDRef.current}`);
                setUUID(newUUID);
            }else{
                navigator(`/${type}/${generatedUUIDRef.current}`);
            }
        } else {
            const isExist = checkObjectArray(`${currentUserName}-resource`, uuid);
            if (!isExist) {
                const item = {uuid, type, state: 'update'};
                setUpdateState(true);
                setMode(MODE.loading);
                
                fetchAndSave().then(_ => {
                    saveObjectArray(`${currentUserName}-resource`, item);
                    if (!(mode & MODE.consent))
                        setMode(MODE.ready);
                });
            } else {                                
                const item = {uuid: uuid, type, state: 'create'};
                saveObjectArray(`${currentUserName}-resource`, item);
                if (!(mode & MODE.consent))
                    setMode(MODE.ready);
            }
            save(uuid, 'type', type);
        }
    // }, [uuid,mode]);
    }, []);

    const resourceLogic = () => {
        switch (type) {
            case 'product':
                return (
                    <UpsertProduct updateState={updateState} uuid={uuid}/>
                )
            case 'post':
                return (
                    <UpsertPost updateState={updateState} uuid={uuid}/>
                )
            case 'project':
                return (
                    <UpsertProject updateState={updateState} uuid={uuid}/>
                )
            default:
                break;
        }
    }

    const onComplete = useCallback(_ => {
        setMode(prev => prev ^ MODE.consent | MODE.ready);
    });

    return (
        <>
            <div className="flex flex-col p-8 mx-auto w-full">
                {mode & MODE.consent ? <TermsConditions onComplete={onComplete}/> : <></>}
                {mode & MODE.ready ?
                    <form id="submitForm" className="flex flex-col w-full p-5 gap-3" onSubmit={submitHandler}>
                         {resourceLogic()}
                    </form> : <></>
                }
            </div>
        </>
    )
}
