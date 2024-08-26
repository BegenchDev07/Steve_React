import { useEffect, useRef, useState } from "react";

import './index.css'


const IntroPage = () => {
    const [ratio,setRatio] = useState(null);
    const refEle = useRef(null)
    const [intersect, setIntersect] = useState(false)
    const [delta,setDelta] = useState(0);
    // const yt_init = 43.24

    const [deltaY, setDeltaY] =  useState(0);

    // const callbackFunc = (entries) => {
    //     entries.forEach((result)=>{
    //         if(result.isIntersecting){
    //             setIntersect(result.isIntersecting)
    //             setRatio(prev => result.intersectionRatio.toFixed(3))
    //
    //         } else {
    //             setRatio(0);
    //             setIntersect(false);
    //         }
    //
    //     })
    // }
    //
    // const options = {
    //     root: null,
    //     rootMargin: "0px",
    //     // threshold: [0.1,0.2,0.3,0.4,0.5]
    //     threshold: [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0]
    // }
    //
    //
    //
    // useEffect(()=>{
    //     const observer = new IntersectionObserver(callbackFunc,options)
    //     if(refEle.current){
    //          observer.observe(refEle.current)
    //     }
    //     return () => {
    //         if(refEle.current) observer.disconnect()
    //     }
    // },[refEle,options,intersect])



    const onWheel = (e) => {

        e.stopPropagation();

        const ref = document.getElementById('ref');
        const deltaY = -ref.getClientRects()[0].top;
        setDeltaY(deltaY)

        console.log(deltaY);
    }

    return(
        <div id="container" onWheel={onWheel}>
            <div id="ref">
                <div id="stage-1" style={{
                    transform: `translateY(${deltaY}px)`
                }}>
                    <div id="square"  />
                    <div id="square1"  />
                    <div id="square2"  />
                    <div id="square3"  />
                </div>

            </div>


            <div id="stretcher"></div>
        </div>
    )

}


export default IntroPage;