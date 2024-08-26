import { useEffect, useState } from "react"
import {getS3, fetchIndexJson} from "/src/utils/reader.js";
import { useParams } from "react-router-dom";
import {isDraft} from "../utils/urlOperation.js";
import PostDetail from "./PostDetail";
import ProjectDetail from "./ProjectDetail";
import ProductDetail from "./ProductDetail.jsx";
import {clearDraft} from "../utils/urlOperation.js";
import { apiCatcher } from "../utils/apiChecker.js";
import { useAppDispatch } from "../redux/hooks.js";
import { getResource } from "../services/API/resource/index.js";


const DetailRelay = () => {
    const s3 = getS3();    
    const [temps, setTemps] = useState(null);
    const {username, uuid} = useParams();        
    const dispatch = useAppDispatch();

    const fetchResource = (type) => {
        // debugger;
        return apiCatcher(dispatch, getResource, uuid, type)        
    } 


    const fetchData = async() => {
        let tempSettings;
        let ref;
        if(isDraft(uuid)){
            tempSettings = JSON.parse(localStorage.getItem(clearDraft(uuid)) || '{}');
        } else {            
            ref = await fetchIndexJson(s3, username, uuid)                        
            // debugger;
            tempSettings = await fetchResource(ref.type)
            tempSettings['content'] = ref.content
            // debugger
        }            
        setTemps(tempSettings)
    }

    const relayLogic = () => {
        switch (temps.type) {
            case 'product':
                return (<ProductDetail details={temps}/>)                

            case 'project':
                return (<ProjectDetail details={temps}/>)                

            case 'post':
                return (<PostDetail details={temps}/>)                

            default:
                break;
        }
    }
    useEffect(()=>{
        fetchData();
    },[])

    return (
        <>
        {
        (temps!=null)
        &&
        relayLogic()
        }
        </>
    )
}
export default DetailRelay;