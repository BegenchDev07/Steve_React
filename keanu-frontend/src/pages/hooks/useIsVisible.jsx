import { useEffect, useState } from "react";

export function useIsVisible(ref) {
    const [isIntersecting, setIntersecting] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
          setIntersecting(entry.isIntersecting)
      } 
      );
      
      observer.observe(ref.current);
      console.log(observer.thresholds)
      return () => {
        observer.disconnect();
      };
    }, [ref]);
  
    return isIntersecting;
  }