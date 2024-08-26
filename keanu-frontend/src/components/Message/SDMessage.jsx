import React, {useEffect, useRef, useState} from "react";
import {fetchInferImage, genUUID, getS3} from "../../utils/reader.js";
import GHLoading from "../GHLoading/index.jsx";
import {FiChevronDown, FiChevronUp, FiCopy} from 'react-icons/fi';
import {ParamTable} from "../Table/index.js";
import {SD_LAYOUT} from "../../constants/LayoutConstant.js";

export default function SDMessage({message, setMessageObj, type}) {
    const content = message?.content ?? {};

    const params = content?.params ?? {};
    const [jsonData, setJsonData] = useState(params);

    const uuid = genUUID();

    const images = content?.images ?? [];
    const imageS3Link = images[0] ?? "";
    const [imageLink, setImageLink] = useState("");

    const STATUS = {idle: 1, loading: 2, finish: 4};
    const [imageStatus, setImageStatus] = useState(STATUS.idle);

    const LAYOUT = {req: 1, res: 2, preview: 4};

    const s3 = getS3();

    const [isParamsVisible, setIsParamsVisible] = useState(false);

    const handleParamsVisibility = () => {
        setIsParamsVisible(!isParamsVisible);
    };

    const isUpdated = useRef(false);

    const handleUpdate = () => {
        isUpdated.current = true;
    }

    const handleCopy = () => {
        const msgContent = {
            params: jsonData, // use the same params in jsondata
            type: "SD_client_infer_req",
            uuid: uuid,
            text: `Copy the params from the previous message ${content.uuid}`,
        }

        const newObj = {
            type: "SD_client_infer_req",
            content: msgContent
        }

        setMessageObj(newObj);
    }

    const maxHeight = (() => {
        switch (type) {
            case SD_LAYOUT.SD_REQ_NALLOW:
                return '512px';
            case SD_LAYOUT.SD_RES_NALLOW:
                return '512px';
            case SD_LAYOUT.SD_PREVIEW_NALLOW:
                return '256px';
            default:
                return '512px';
        }
    })();

    const renderParams = () => {
        return (
            <div
                className="w-full h-full p-2 bg-gray-200 border border-gray-300 rounded max-w-60 flex items-center">

                <div className="flex-grow-0 mx-2">
                    {jsonData?.prompt && (
                        <span><span className="font-bold">prompt</span>: {jsonData.prompt}</span>
                    )}
                </div>

                <div className="flex flex-col gap-y-5 flex-shrink-0 w-1/6">
                    <button onClick={handleCopy}><FiCopy/></button>
                    <button onClick={handleParamsVisibility}>
                        {isParamsVisible ? <FiChevronUp className="-rotate-90"/> :
                            <FiChevronDown className="-rotate-90"/>}
                    </button>
                </div>
            </div>
        )
    }

    const renderImage = () => {
        switch (imageStatus) {
            case STATUS.loading:
                return <GHLoading width={256} height={256}/>;
            case STATUS.finish:
                return <img src={imageLink} alt="infer image" className="w-full max-w-64 max-h-64 mt-6"/>;
            default:
                return null;
        }
    }

    useEffect(() => {
        if (imageS3Link !== "") {
            setImageStatus(STATUS.loading);
            fetchInferImage(s3, imageS3Link).then((link) => {
                setImageLink(link);
                setImageStatus(STATUS.finish);
            });
        }
    }, [imageS3Link]);

    // if jsonData change,then setMessageObj
    useEffect(() => {
        if (!isUpdated.current) return;
        // if the type is preview, we don't need to send the message
        if (type === LAYOUT.preview) return;

        const msgContent = {
            params: jsonData, // use the same params in jsonData
            type: "SD_client_infer_req",
            uuid: uuid,
            text: `Edit the params from the previous message ${content.uuid}`,
        }

        const newObj = {
            type: "SD_client_infer_req",
            content: msgContent
        }

        setMessageObj(newObj);
    }, [jsonData]);

    return (
        <div className="flex p-4 w-full max-w-2xl bg-white rounded">
            <div className="flex flex-col items-center mb-4 space-y-6">
                {renderParams()}
                {renderImage()}
            </div>

            {isParamsVisible && (
                <div className="p-4 bg-gray-100 border border-gray-300 rounded mt-2 md:mt-0 md:ml-4 flex-1">
                    <ParamTable params={jsonData} setParams={setJsonData} maxHeight={maxHeight} onUpdate={handleUpdate}
                                type={SD_LAYOUT.single}/>
                </div>
            )}
        </div>
    );
}