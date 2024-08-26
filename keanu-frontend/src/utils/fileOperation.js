// euds: uploadPath,uuid,flag can be reduce as a single prop: path
// const editFileURL = (data,path) => {
//     const some = [...data].map((file) => {
//         if (file instanceof File) {
//             file['url'] = `${uploadPath}/${uuid}/${flag}/${file.name}`;
//         }
//         return file
//     })
//     return some;
// };

// import {createAlert} from "/src/redux/reducers/AlertSlice.ts";

import {$checkPreviewImage, readAsDataURL} from "./reader.js";
import fileIcon from "../assets/icons/file.svg";

export const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 5*1024*1024

// const addNewFiles = (dispatch, originFiles, newFiles, maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES) => {
//     for (let file of newFiles) {
//         if (file.size < maxFileSizeInBytes) { // euds: may need raise an error if file is too large
//             // euds: using name which is given by the user is risky, a unique id may be a good idea
//             // euds: using name to check for duplicates is not a good idea, as the name can be the same but the content different
//             originFiles.push(file);
//         } else {
//             dispatch(createAlert({
//                 type: 'error',
//                 message: `file ${file.name} is too large, the max size is ${maxFileSizeInBytes / (1024 * 1024)} MB`
//             }))
//         }
//     }
// };

// const removeDuplicates = (data) => {
//     return [...new Set(data)];
// };
//
// function isObjectEmpty(obj) {
//     if (obj) {
//         return Object.keys(obj).length === 0;
//     }
//     return true;
// }
function getImageInfo(url){
    return new Promise(res=>{
        const image = new Image();
        image.src = url;
        image.onload = _=>res({width:image.width, height:image.height});
    })
}
function getImage(url){
    return new Promise(res=>{
        const image = new Image();
        image.src = url;
        image.onload = _=>res(image);
    })
}
function genImagePreviewURL(file) {    
    return URL.createObjectURL(file);
}

const genImageLinkByFile = async (file) => {
    if ($checkPreviewImage(file.type)) {
        const link = genImagePreviewURL(file);
        return Promise.resolve(link);
    } else if (file instanceof Blob) {
        return readAsDataURL(file).then((link) => {
            return link;
        });
    } else {
        return Promise.resolve(fileIcon);
    }
};

export {genImagePreviewURL,getImage,genImageLinkByFile};
