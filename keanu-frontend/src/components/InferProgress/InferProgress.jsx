import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from "react";
import {useAppSelector} from "../../redux/hooks";
import {fetchInferImage, getS3} from "../../utils/reader.js";
import GHLoading from "../GHLoading/index.jsx";
import AISTATUS from "../../../../share/AISTATUS.mjs";
import {INFER_PROGRESS_LAYOUT} from "../../constants/LayoutConstant.js";
import {FileContext} from "../../utils/context.js";
import {db} from "../../utils/dexie/db.js";
import {getFilesStartsWith} from "../../utils/dexie/operation.js";

const InferProgress = forwardRef(function _InferProgress({layoutType,uuid,handleEnd}, ref) {
    const [imageS3Link, setImageS3Link] = useState("");
    const [imageLink, setImageLink] = useState('');
    const [previewLinks, setPreviewLinks] = useState([]);

    // loading means the s3 link has already get , the picture is loading
    // finish means the picture is fetched,and ready to show
    const STATUS = {idle: 1, waiting: 2, working: 3, uploading: 4, loading: 5, finish: 6, error: 7};
    const [status, setStatus] = useState(STATUS.idle);

    const s3 = getS3();

    const [loadingPercentage, setLoadingPercentage] = useState(null);
    const [errorMessages, setErrorMessages] = useState("");

    const previewCountRef = useRef(0);

    const notification = useAppSelector((state) => state.notification);

    useEffect(() => {
        if (!notification) return;

        // check if the notification's uuid is the same
        const jobUUID = notification.uuid;
        if(!jobUUID) return;
        if(uuid !== jobUUID) return;

        const {type, value} = notification;
        switch (type) {
            case AISTATUS.inferStart:
                setStatus(STATUS.working);
                break;
            case AISTATUS.inferUpdateProgress:
                setLoadingPercentage(value);
                break;
            case AISTATUS.inferUpdateDetail:
                console.log("inferUpdateDetail", value);
                break
            case AISTATUS.inferEnd:
                setLoadingPercentage(1);
                // image is made , but need some time to upload to s3
                setStatus(STATUS.uploading);
                break;
            case AISTATUS.uploadEnd:
                // image is uploaded to s3,and we get the link
                setLoadingPercentage(null);
                // due to we may receive multiple uploadEnd, so we need to check the status
                if (status !== STATUS.finish) {
                    setStatus(STATUS.loading);
                    // console.log("Value here", value);
                    setImageS3Link(value?.[0]);
                }
                break;
            case AISTATUS.inferError:
                setStatus(STATUS.error);
                setErrorMessages(value);
                break;
            default:
                break;
        }
    }, [notification]);

    const renderResult = () => {
        switch (status) {
            case STATUS.idle:
                if (layoutType === INFER_PROGRESS_LAYOUT.demo) {
                    return <h1>Input or select config file and then click submit</h1>;
                } else {
                    return null;
                }
            case STATUS.waiting:
                return <h1>Please wait for your turn...</h1>;
            case STATUS.working:
                return (
                    <div>
                        <h1>Working...</h1>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-blue-600 h-4 rounded-full"
                                style={{width: `${loadingPercentage * 100}%`}}
                            ></div>
                        </div>
                    </div>
                );
            case STATUS.uploading:
                return <div>
                    <h1>Uploading image to s3...</h1>
                </div>
            case STATUS.loading:
                return;
            case STATUS.finish:
                return <h1>Finish</h1>;
            case STATUS.error:
                return <div>
                    <h1>Error: </h1>
                    <h2 className="text-red-400">{errorMessages}</h2>
                </div>;
            default:
                return <h1>Idle</h1>;
        }
    };

    const renderImage = () => {
        let length = (_ => {
            switch (layoutType) {
                case INFER_PROGRESS_LAYOUT.demo:
                    return 1080;
                case INFER_PROGRESS_LAYOUT.inbox:
                    return 256;
                default:
                    return 1080;
            }
        })();
        return (
            <>
                {status === STATUS.loading && imageLink === "" && <GHLoading width={length} height={length}/>}
                {imageLink && <img src={imageLink} alt="infer image"/>}
            </>)
    }

    const renderPreview = () => {
        return (
            (previewLinks.length > 0) &&
            <div className="flex flex-wrap my-5">
                {previewLinks.map((link, index) => {
                    return <img key={index} src={link} alt="infer image"/>
                })}
            </div>
        )
    }

    const _clear = () => {
        setImageLink('');
        setImageS3Link('');
        setStatus(STATUS.idle);
        previewCountRef.current = 0;
        setPreviewLinks([]);
    }

    useImperativeHandle(ref, () => {
        return {
            clear() {
                _clear()
            }
        };
    }, []);


    useEffect(() => {
        if (imageS3Link === "") return;
        fetchInferImage(s3, imageS3Link).then((link) => {
            setStatus(STATUS.finish);
            setImageLink(link)
        });
        getFilesStartsWith(uuid).then((collections) => {
            const links = collections.map((item) => item.file);
            //console.log("links", links);
            setPreviewLinks(links);
        });
    }, [imageS3Link]);

    useEffect(() => {
        if (status === STATUS.error || status === STATUS.finish) {
            if (layoutType === INFER_PROGRESS_LAYOUT.inbox) {
                setTimeout(() => {
                    _clear();
                    if(handleEnd){
                        handleEnd();
                    }
                }, 5000);
            }
        }
    }, [status]);

    const filesObj = useContext(FileContext);
    useEffect(() => {
        if (filesObj) {
            console.log("=========filesObj", filesObj);
            if (uuid) {
                const base64 = filesObj[uuid]?.slice(-1)[0];
                if (base64) {
                    const imageBase64 = "data:image/png;base64," + base64;
                    setImageLink(imageBase64);
                    previewCountRef.current++;
                    const url = `${uuid}_${previewCountRef.current}`;
                    db.images.put({url: url, file: imageBase64});
                }
            }
        }
    }, [filesObj]);

    return (
        <div>
            {renderResult()}
            {renderImage()}
            {renderPreview()}
        </div>
    )
});

export default InferProgress;