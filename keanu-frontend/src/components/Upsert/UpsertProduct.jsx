import { ContextSection } from "../Section";
import {FileSection} from "../Section";
import {MultipleSection} from "../Section";

const UpsertProduct = ({uuid,updateState}) => {
    return (
        <div className="flex flex-col gap-10 w-full h-auto">
            <ContextSection/>
            <FileSection/>
            <MultipleSection/>
        </div>
    )
}
export default UpsertProduct;