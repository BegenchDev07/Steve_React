import {useState, useRef, useEffect} from "react"
import {useAppDispatch} from "../../redux/hooks";
import {createAlert} from "../../redux/reducers/AlertSlice";
import {DEFAULT_MAX_FILE_SIZE_IN_BYTES, genImageLinkByFile} from "../../utils/fileOperation";
import fileIcon from '../../assets/icons/file.svg';
import {genUUID} from "../../utils/reader.js";
export const FILE_UPLOAD_MODE = {multiple: 1, dropzone: 2, single: 4};

// eu: find a well-designed component: https://primereact.org/fileupload/#api.FileUpload.props
// eu: we can use the above component as a reference to improve our FileUpload component
export function FileUpload({mode, fileType, onFilesChange, maxCount = 5, initFiles = []}) {
    const fileInputField = useRef(null);
    const [files, setFiles] = useState([]);
    const [availableFileCount, setAvailableFileCount] = useState(maxCount - initFiles.length);
    const dispatch = useAppDispatch();
    const [imageLinks, setImageLinks] = useState([]);

    const addNewFile = (newFiles) => {
        // check file size
        for (let file of newFiles) {
            if (file.size > DEFAULT_MAX_FILE_SIZE_IN_BYTES){
                dispatch(createAlert({
                    type: 'error',
                    message: `file ${file.name} is too large, the max size is ${DEFAULT_MAX_FILE_SIZE_IN_BYTES / (1024 * 1024)} MB`
                }))
                // remove the file from the newFiles array
                newFiles = newFiles.filter((f) => f !== file);
            }
        }

        setFiles(prev => {
            const _files = [...prev, ...newFiles];
            onFilesChange(Array.from(_files));
            return _files;
        });
    }

    const _addFile = (event) => {
        // newFiles is a FileList object
        const {files: newFiles} = event.target;

        if (availableFileCount >= newFiles?.length) {
            setAvailableFileCount(availableFileCount - newFiles.length)
            addNewFile(Array.from(newFiles));
        } else {
            dispatch(createAlert({
                type: 'warning',
                message: `resource files are limited to ${maxCount} files`
            }))
            event.target.value = null
        }
    }

    const _removeFile = (data) => {
        const fileName = data.name ?? data['display-name'];
        if (fileName) {
            const delIndex = Object.values(files).findIndex(ele => ele === data);
            const ref = Array.from(files)
            ref.splice(delIndex, 1)
            setFiles((files.length === 0) ? [] : ref);
            onFilesChange(ref);

            setAvailableFileCount(availableFileCount + 1);
        }
    };

    const genImageLinks = async (files) => {
        // eu: clone the imageLinks array seems unnecessary
        const newImageLinks = [...imageLinks]; // Clone the imageLinks array

        const promises = files.map((file, index) => {
            // returns the promise created by generateImageLinkByFile(file).
            return genImageLinkByFile(file).then((link) => {
                newImageLinks[index] = link;
                return link;
            });
        });

        return Promise.all(promises).then(() => {
            return newImageLinks;
        });
    };

    useEffect(() => {
        if (initFiles.length !== 0) {
            setFiles(initFiles);
            setAvailableFileCount(maxCount - Object.keys(initFiles).length);
        }
    }, [initFiles])

    useEffect(() => {
        if (files.length > 0) {
            genImageLinks(files).then(
                (links) => {
                    setImageLinks(links);
                }
            );
        }
    }, [files]);

    function renderImage(file, index) {
        const imageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml'];

        const isImage = imageTypes.includes(file.type.toLowerCase());

        return (
            <>
                {isImage ? (
                    <img src={imageLinks[index]} className="w-18 h-18 rounded-md object-fit border"
                         alt={file?.name ?? ""}/>
                ) : (
                    <div className="file-icon-wrapper">
                        <img src={fileIcon} className="w-18 h-18 rounded-md object-fit border"
                             alt={file?.name ?? ""}/>
                        <span className="file-name">{file?.name ?? "Unknown file"}</span>
                    </div>
                )}
            </>
        );
    }


    function renderCancelButton(data) {
        return (
            <a
                className="w-full h-3 z-15 cursor-pointer flex justify-end text-red-500"
                onClick={() => {
                    _removeFile(data)
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5}
                     stroke="currentColor" className="w-3 h-3 self-end">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </a>
        );
    }

    function renderPreview() {
        // euds: should rewrite the css
        return (
            <div className="flex flex-col gap-3 items-start justify-center pt-5 pb-6 px-2">
                <div className="grid grid-cols-4 grid-flow-row content-center w-full h-auto px-2 py-1 gap-3">
                    {
                        Object.values(files).map((file, index) => {
                            return (
                                <div key={index}
                                     className="w-26 h-26 rounded-lg flex flex-col  items-center justify-center">
                                    {renderCancelButton(file)}
                                    {renderImage(file,index)}
                                </div>
                            )
                        })
                    }
                    {
                        (mode & FILE_UPLOAD_MODE.multiple) && (availableFileCount !== 0) &&
                        <label
                            className="self-center flex mx-auto items-center justify-center w-16 h-16 rounded border border-green-400 cursor-pointer">
                            <h1 className="font-thin">
                                + {availableFileCount}
                            </h1>
                            <input type="file" ref={fileInputField} onChange={_addFile} className="hidden" multiple/>
                        </label>
                    }
                </div>
            </div>
        );
    }

    // return input according to the mode and fileType
    function renderInputField() {
        const isMultiple = mode & FILE_UPLOAD_MODE.multiple;
        // if fileType is not null, set accept attribute, otherwise set empty object
        // this means that filter has no effect if fileType is null        
        const acceptFileType = fileType ? {accept: fileType} : {};
        return (
            <div className="w-full flex flex-col gap-3 items-center justify-center">
                <div className="w-full">
                    <input
                        required={true}
                        name={genUUID()}
                        type="file"
                        ref={fileInputField}
                        {...acceptFileType}
                        onChange={_addFile}
                        className="block w-full text-lg text-gray-400 border-2 border-dashed border-gray-300 rounded cursor-pointer bg-gray-200 focus:outline-none "
                        multiple={!!isMultiple}/>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-center w-full h-full">
                {
                    (files.length !== 0) ? renderPreview() : renderInputField()
                }
            </div>
        </div>
    )
}