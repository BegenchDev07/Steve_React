import {forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import Content from "./content";
import {calBinNum} from "../../utils/responsiveOperation.js";
import {$debounce, debounce, genUUID} from "../../utils/reader.js";

import {lock} from "../../utils/locker.js";

const Masonry = forwardRef(({root, pagination,initData, getData, fetch, delData = () => {}},
                            ref) => {
    const [data, setData] = useState([]);

    const take = pagination.take;
    const skip = useRef(0);

    const STATE = {init:1,refresh: 2, append: 4, load:8, end:16};
    // const [state, setState] = useState(STATE.init);
    const state = useRef(STATE.init);
    const [pageIndexMap, setPageIndexMap] = useState(new Map());

    const onRefresh = useCallback(_=>{
        if(pageIndexMap.get(skip.current)) return;
        // setState(STATE.refresh|STATE.load);
        state.current = STATE.refresh|STATE.load;
        pageIndexMap.set(skip??0, 'loading');
        lock('mason')
            .then(release=>{

                return getData(skip.current, take)
                    .then(comingData =>{
                        if(comingData.length) {
                            // setState(prev=>prev&~STATE.load);
                            state.current &= ~STATE.load;
                            skip.current += take;
                            setData(comingData);
                        }else{

                            // setState(0);
                            state.current = STATE.end;
                        }

                        release();
                    })
            })


    }, [state,skip,pageIndexMap]);



    // delete the item from the dataMap and update the data
    const onDelete = useCallback(uuid =>
        delData(uuid)
            .then(_ => pruneData(uuid, dataMap))
            .then(_ => setData(Array.from(dataMap.values()))), [])


    useImperativeHandle(ref, () => {
        return {
            refresh(newSkip=0) {
                // setSkip(newSkip);
                skip.current = newSkip;
                // setState(STATE.init);

                state.current = STATE.init;
                setPageIndexMap(new Map());
                setData([]);
                // initData is a function from the parent component,so we should check if it is null
                if(initData != null)
                    initData()
                        .then(items => {
                            setData(items);
                            skip.current = 0;
                            // setState(STATE.refresh);
                            state.current = STATE.refresh;
                        });
            }
        }
    })

    const binNumRef = useRef(calBinNum(window.innerWidth));

    // once the window is resized, the masonry get re-rendered,but will not fetch data
    useEffect(() => {
        const handleResize = debounce(() => {
            binNumRef.current = calBinNum(window.innerWidth);
            console.log(calBinNum(window.innerWidth));
            // setSkip(0); // reset the skip

            skip.current = 0;
        });

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const containerRef = useRef(null);


    // useEffect(() => {
    //
    // }, [state]);

    useEffect(() => {},[data]);
    return (        
        <Content
            root={root}
            ref={containerRef}
            onRefresh={onRefresh} onDelete={onDelete}
                 products={data} offsetY={100} fetch={fetch} binNum={binNumRef.current}/>
    );
});

export default memo(Masonry);