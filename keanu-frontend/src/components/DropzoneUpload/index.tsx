import { useState } from "react";
import Dropzone from "react-dropzone";
// import { UploadOutlined } from "@ant-design/icons";

import CosSingleton from "../../services/API/cos/cosSingleton";
import { useNavigate } from "react-router-dom";

const DropzoneUpload = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleDrop = async (acceptedFiles) => {
    setFiles(acceptedFiles);
    await handleUpload(acceptedFiles);
    navigate(location.pathname, { replace: true });
  };

  const handleUpload = async (files) => {
    setUploading(true);
    const totalFiles = files.length;
    let completedFiles = 0;
    let totalProgress = 0;

    for (const file of files) {
      const key = `${file.path}`;
      try {
        await CosSingleton.uploadFile(
          projectId,
          `${projectId}/${key}`,
          file,
          (err, data) => {
            if (err) {
              console.error(err);
              return;
            }

            const percent = (data.loaded / data.total) * 100;
            totalProgress += percent;
            setProgress(totalProgress / totalFiles);
          }
        );
      } catch (err) {
        console.error(err);
      }

      completedFiles++;
      if (completedFiles === totalFiles) {
        setProgress(100);
        setFiles([]);
        setUploading(false);
      }
    }
  };

  // const handleUpload = async (files) => {
  //   setUploading(true);

  //   for (const file of files) {
  //     //const key = `${Date.now()}_${file.name}`;
  //     const key = `${file.path}`;
  //     try {
  //       setUploading(true);
  //       await CosSingleton.uploadFile(
  //         projectId,
  //         //`${projectId}/${key}`,
  //         // upload to root curr directory
  //         `${projectId}/.doc/${key}`,
  //         // upload to root curr directory
  //         file,
  //         (err, data) => {
  //           const percent = (data.loaded / data.total) * 100;
  //           console.log(percent);
  //           setProgress(data.percent);
  //         }
  //       );
  //     } catch (err) {
  //       console.error(err);
  //     }
  //     setProgress(100);
  //     setFiles([]);
  //   }
  //   setProgress(100);
  //   setFiles([]);
  //   setUploading(false);
  // };

  return (
    // <div>
    //   <Dropzone onDrop={handleDrop}>
    //     {({ getRootProps, getInputProps }) => (
    //       <div
    //         {...getRootProps()}
    //         className="flex items-center justify-center border-2 border-dashed rounded-md border-gray-400 p-4"
    //       >
    //         <input {...getInputProps()} />
    //         <div className="flex flex-col items-center justify-center">
    //           <UploadOutlined style={{ fontSize: "3rem" }} />
    //           <p className="mb-2 text-sm text-gray-500 text-center text-gray-400">
    //             Drag and drop files here or click to select
    //           </p>
    //           <p className="text-xs text-gray-500 text-center text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
    //         </div>
    //       </div>
    //     )}
    //   </Dropzone>
    //   {uploading && (
    //     <div className="mt-4">
    //       <div className="relative pt-1">
    //         <div className="flex mb-2 items-center justify-between">
    //           <div>
    //             <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
    //               Upload Progress
    //             </span>
    //           </div>
    //           <div className="text-right">
    //             <span className="text-xs font-semibold inline-block text-blue-600">
    //               {progress}%
    //             </span>
    //           </div>
    //         </div>
    //         <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
    //           <div
    //             style={{ width: `${progress}%` }}
    //             className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
    //           ></div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <>
    </>
  );
};

export default DropzoneUpload;
