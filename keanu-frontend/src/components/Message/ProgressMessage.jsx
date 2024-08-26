import {InferProgress} from "../InferProgress";
import {INFER_PROGRESS_LAYOUT} from "../../constants/LayoutConstant.js";
import React, {useEffect, useRef, useState} from "react";

export default function ProgressMessage({message,setIsShow}) {
    const progressRef = useRef(null);

    const currentJobUUID = message.content.uuid;

    const handleEnd = _ => setIsShow(false);

    useEffect(() => {
        console.log(currentJobUUID)
    }, []);

    return (
        <>
            <InferProgress layoutType={INFER_PROGRESS_LAYOUT.inbox} uuid={currentJobUUID} ref={progressRef} handleEnd={handleEnd}/>
        </>
    )
}