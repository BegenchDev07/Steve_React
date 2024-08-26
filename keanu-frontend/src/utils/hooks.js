import {useCallback, useRef} from "react";

// https://medium.com/strise/making-use-of-observers-in-react-a29b1fd05fa7
export const useIntersectionObserver = (options, cb) => {
    const observer = useRef(null)

    return useCallback((node) => {
        if (!node) {
            if (observer.current) {
                observer.current.disconnect()
            }
            return
        }

        observer.current = new window.IntersectionObserver(cb, options)
        observer.current.observe(node)
    }, [])
}