import { ContextSection } from "../Section";
import {FileSection} from "../Section";

const UpdateProject = ({uuid,updateState}) => {
    return (
        <div className="flex flex-col gap-5 w-full h-full">
            {
                (!updateState)
                &&
                <ContextSection/>
            }
            <FileSection/>
            {/* <div className="bg-white rounded-md py-3 px-3">
                <label className="font-semibold text-2xl">
                    Upload Cover Image
                </label>
                <div className="w-full h-1/2">
                    <FileUpload mode={FILE_UPLOAD_MODE.single}
                                onFilesChange={newFiles => handleFilesChange(newFiles, 'cover')}
                                fileType={'image/*'}
                                initFiles={fileList['cover']}/>
                </div>
            </div> */}
        </div>
    )
}

export default UpdateProject;