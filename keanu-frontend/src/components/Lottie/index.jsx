
// @ts-expect-error
//  Could not find a declaration file for module 'lottie-web/build/player/lottie_canvas_worker'. '/workspaces/client-web/node_modules/lottie-web/build/player/lottie_canvas_worker.js' implicitly has an 'any' type.
//  If the 'lottie-web' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lottie-web/build/player/lottie_canvas_worker';
import lottie from "./lottie_canvas_worker.js";
import { useRef, useEffect, forwardRef, useImperativeHandle,useMemo,memo } from "react";


const LottieAnimationInternal = (props,ref) => {
    const elem = useRef(null);
    const animation = useRef(null);
    const autoplay = props.autoplay?? true;
    const {className, animationData,
        loop, title, initialSegment, svgStyles,
        width, height} = props;

    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        // const context = canvas.getContext('2d');
        // context.fillStyle = 'red';
        // context.fillRect(0, 0, width, height);
    }, []);

    useEffect(() => {
        const container = elem.current;
        animation.current = lottie.loadAnimation({
            renderer: "canvas",
            autoplay,
            initialSegment,
            loop,
            animationData,
            container: container,
            rendererSettings: {
                canvas:canvasRef.current,
                className: svgStyles
            }
        } );
        animation.current.play();
        return () => {
            animation.current?.destroy();
        };
    }, [elem, animationData, autoplay, loop, initialSegment, svgStyles]);

    // const sizeStyle = useMemo(() => ({ width, height }), [width, height]);
    useImperativeHandle(ref, () => ({
        play: () => animation.current?.play(),
        stop: () => animation.current?.stop(),
        pause: () => animation.current?.pause(),
        goToAndPlay: (value) => animation.current?.goToAndPlay(value, true),
        goToAndStop: (value) => animation.current?.goToAndStop(value, true),
        playSegments: (value) => animation.current?.playSegments(value, true)
    }), []);

    return (
        <div            
            aria-label={title}
            title={title}
            data-is-focusable={true}
            className={className}
            ref={elem}
            // style={{width:"100%",height:"auto"}}
            {...props.handlers}>
        <canvas style={{width:'100%',height:'auto'}}   ref={canvasRef} width={width} height={height} />
        </div>
    );
};

export const LottieAnimation = memo(
    forwardRef(LottieAnimationInternal)
);

// export const LottieAnimation = LottieAnimationInternal;