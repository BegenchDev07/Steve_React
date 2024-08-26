import { useEffect, useRef, useState } from "react";
import { useIsVisible } from "./hooks/useIsVisible";



const TestLand = () => {
    const [ratio,setRatio] = useState(0);
    const refEle = useRef(null)
    const callbackFunc = (entries) => {
        // const [entry] = entries 
        entries.forEach(({intersectionRatio})=>{
            intersectionRatio
            // debugger;
            setRatio(prev => intersectionRatio.toFixed(3))            
        })
    }

    const options = {
        root: null,
        rootMargin: "0px",
        threshold: [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0]
    }

    useEffect(()=>{
        const observer = new IntersectionObserver(callbackFunc,options)
        if(refEle.current) observer.observe(refEle.current)
        
        return () => {
            if(refEle.current) observer.unobserve(refEle.current)
        }

    },[refEle,options])

    return(
        <div>
            <div className="w-full h-full" 
            style={{opacity:`${(ratio <= 0.9) ? 1.0 - ratio : 1.0}`}}
            >
                <div 
                className="absolute top-10"                             
                style={{
                    left:`-${(ratio != 0) && 2 - ratio}rem`
                }}
                >
                    <img className="w-56 h-56" src="https://cdn.prod.website-files.com/6335b33630f88833a92915fc/63ebce23e53ac60a7fa7bd43_hero%20youtube.png" loading="lazy" alt=""/>
                </div>
                <div className="h-screen flex flex-col items-center justify-center mx-auto">
                    <h1 className="text-5xl font-bold">Isometric</h1>
                    <h1 className="text-5xl font-bold">Game engine and Level editor</h1>
                    <h1 className="text-5xl font-bold">2 in 1 tool</h1>
                </div>
                
            </div>
            <div ref={refEle}>
                <div className="h-[36rem] w-full">

                </div>                
            </div>
            <div className="mx-auto container h-1/2">
                <img className="rounded-xl" src="https://images.pexels.com/photos/17238245/pexels-photo-17238245/free-photo-of-man-posing-in-shirt-on-grassland.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
            </div>
            <div className="h-[30rem] w-full">

            </div>
        </div>
    )

}


export default TestLand;