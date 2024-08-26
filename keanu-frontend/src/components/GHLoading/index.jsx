import ghLoading from "../../assets/lottie/logo.json";
import {useRef} from "react";
import {LottieAnimation} from "../Lottie/index.jsx";

export default function GHLoading({width, height}) {
    const ref = useRef(null);

    return (<>{
        <>
            <LottieAnimation ref={ref} autoplay={true} width={width} height={height} animationData={ghLoading}/>
        </>
    }</>);
}