import React, {useEffect, useRef, useState} from "react";
import {JsonEditor} from "json-edit-react";
import {FILE_UPLOAD_MODE, FileUpload} from "../components/FileUpload/index.js";
import {handleFilesChange} from "../components/Section/FileSection.jsx";
import {useAppDispatch, useAppSelector} from "../redux/hooks.js";
import {debounce, genUUID} from "../utils/reader.js";
import {apiCatcher} from "../utils/apiChecker.js";
import {genSDImage} from "../services/API/project/index.ts";
import {InferProgress} from "../components/InferProgress/index.js";

export default function InferDemo() {
    const [jsonData, setJsonData] = useState(
        {
            "prompt": "",
            "negative_prompt": "",
            "sd_model_name": "SDXLPixelArtBase_v10",
        })
    const [files, setFiles] = useState([])

    const dispatch = useAppDispatch();

    const currentUserName = useAppSelector((state) => state.auth.user.username);
    const [currentJobUUID,setCurrentJobUUID] = useState("");

    const progressRef = useRef(null);

    const handleSubmit = debounce((e) => {
        e.preventDefault();
        console.log(jsonData);
        // todo: need to read from url
        const projectId = 'eu-bebop';
        const uuid = genUUID();
        setCurrentJobUUID(uuid);
        apiCatcher(dispatch, genSDImage, projectId, uuid, jsonData).then((result) => {
            progressRef.current?.clear();
        });
    }, 700);

    const renderInferConfigUploader = (id) => {
        return (<FileUpload mode={FILE_UPLOAD_MODE.single}
                            fileType={'application/json'}
                            onFilesChange={newFiles => handleFilesChange(newFiles, 'train_config', `${currentUserName}/.profile`, "6666",
                                (files) => {
                                    setFiles(files);
                                }, false)}
                            initFiles={[]}
        />);
    }

    useEffect(() => {
        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    setJsonData(json);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(files[0].file);
        }
    }, [files]);

    return (
        <div className="flex flex-col p-8 mx-auto w-full">
            <div className="flex flex-row">
                <div className="flex flex-col w-full p-5 gap-3">
                    <div className="flex flex-col gap-10 w-full h-auto">
                        <div className="w-fit flex items-start justify-start gap-3 px-3">
                            <div className="w-1/4">
                                <h1 className="text-xl font-bold">Train Config:</h1>
                            </div>
                            <div className="w-fit">
                                {renderInferConfigUploader()}
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-end px-2 py-2">
                        <button
                            onClick={handleSubmit}
                            className="px-1 py-1 bg-blue-600 text-white rounded-md">
                            Submit
                        </button>
                    </div>
                    <InferProgress ref={progressRef} uuid={currentJobUUID}/>
                </div>

                <JsonEditor
                    className="flex w-full grow p-5"
                    data={jsonData}
                    setData={setJsonData} // optional
                />
            </div>
        </div>
    )
}