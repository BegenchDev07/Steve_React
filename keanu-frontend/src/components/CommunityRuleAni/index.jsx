import rulePost from "../../assets/lottie/rulePost.json";
import {useRef} from "react";
import {LottieAnimation} from "../Lottie/index.jsx";

export default function CommunityRuleAni({width, height}) {
    const ref = useRef(null);

    return (<>{
        <>
            <LottieAnimation ref={ref} autoplay={true} width={width} height={height} animationData={rulePost}/>
        </>
    }</>);
}