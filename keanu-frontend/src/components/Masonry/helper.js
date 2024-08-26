import {createContext} from "react";

const LOADING_DEBUGGER = false;

export const checkVis = (container, controlMap, viewOffsetY) => {
    const
        viewBottom = window.innerHeight,
        viewTop = viewOffsetY;

    for(const bin of container.children){
        for (const child of bin.children) {
            if(LOADING_DEBUGGER) continue;
            if(child.getClientRects().length === 0)
                continue;
            const {bottom, top} = child.getClientRects()[0];
            debugger;
            if (!(bottom < viewTop || top > viewBottom)) {
                const id = child.getAttribute("id");
                if (id){
                    controlMap.set(id.toString(), true);
                }
            }
        }
    }

    return controlMap;
}

export const MasonryContext = createContext();