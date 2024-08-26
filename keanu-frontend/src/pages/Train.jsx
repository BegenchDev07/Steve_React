import {FILE_UPLOAD_MODE, FileUpload} from "../components/FileUpload/index.js";
import {handleFilesChange} from "../components/Section/FileSection.jsx";
import {useAppSelector} from "../redux/hooks";
import {JsonEditor} from "json-edit-react";
import {useEffect, useState} from "react";

export default function Train() {
    const [jsonData, setJsonData] = useState({test: 'test'})
    const [files, setFiles] = useState([])

    const currentUserName = useAppSelector((state) => state.auth.user.username);

    const submitHandler = (e) => {

    }

    const trainConfigUploader = (id) => {
        return (<FileUpload mode={FILE_UPLOAD_MODE.single}
                            fileType={'application/json'}
                            onFilesChange={newFiles => handleFilesChange(newFiles, 'train_config', `${currentUserName}/.profile`, "6666",
                                (files) => {
                                    // const fileBlobArr = files.map(({url, file}) => ({id, type: 'cover', url, file}));
                                    // setFileBlobArr(prev => [prev.filter(ele => ele.id !== id), ...fileBlobArr]);
                                    //
                                    // files = files.map(ele => ({...ele, file: undefined}));
                                    // const ref = itemsArr
                                    // ref.find((ele) => {
                                    //     if (ele.id === id)
                                    //         ele.cover = files;
                                    // })
                                    // setItemsArr([...ref]);
                                    setFiles(files);
                                },false)}
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
        <>
            <div className="flex p-8 mx-auto w-full">
                <form id="submitForm" className="flex flex-col w-full p-5 gap-3" onSubmit={submitHandler}>
                    <div className="flex flex-col gap-10 w-full h-auto">
                        <div className="w-full flex flex-col items-start justify-start gap-3 px-3">
                            <h1 className="text-xl font-bold">Train Config:</h1>
                            {trainConfigUploader()}
                        </div>
                    </div>
                </form>

                <JsonEditor
                    className="w-full grow p-5"
                    data={jsonData}
                    setData={setJsonData} // optional
                />
            </div>
        </>
    )
}