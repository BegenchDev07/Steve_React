import { useState } from "react";
import ProjectSection from "../Section/ProjectSection.jsx";
import ProjFileSection from "../Section/ProjFileSection.jsx";
import {useCallback} from "react";
import FileSection from "../Section/FileSection.jsx";

const UpsertProject = ({uuid,updateState}) => {

    const [project, setProject] = useState(null);
    const onProjectName = useCallback(name=>{
        setProject(name);
    },[]);
    return (
        <div className="flex flex-col gap-5 w-full h-full">
            {
                (updateState)
                    ? <ProjFileSection project={project}/>
                    : <>
                        <ProjectSection/>
                        <FileSection/>
                    </>
            }
        </div>
    )
}

export default UpsertProject;