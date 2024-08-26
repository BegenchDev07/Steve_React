import { ContextSection } from "../Section";
import {FileSection} from "../Section";
const UpsertPost = ({uuid,updateState}) => {
    return (
        <div className="flex flex-col gap-5 w-full h-full">
            <ContextSection/>

            <FileSection/>
        </div>
    )
}
export default UpsertPost;