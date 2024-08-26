import {
    Suspense,
    useEffect,
    memo,
    useState,
    useRef,
    forwardRef,
    useContext,
    Fragment,
    useCallback,
    useImperativeHandle
} from 'react';
import {checkVis, MasonryContext} from "./helper";

const DEFAULT_RETRY_DELAY = 1000;

const _check = (conditionFnc, onSuccess, retryDelay = DEFAULT_RETRY_DELAY) => {
    if (conditionFnc()) {
        if (onSuccess) onSuccess();
    } else
        setTimeout(_ => _check(conditionFnc, onSuccess, retryDelay), retryDelay);
}, check = (fnc) => new Promise(resolve => _check(fnc, _ => resolve()));

let promiseCache = new Map();

const getCachedPromise = (id, onCreate) => {
    if (!promiseCache.has(id)) {
        promiseCache.set(id, onCreate())
    }
    return promiseCache.get(id)
};

function use(id, controlMapRef, fnc, ...params) {
    const promise = getCachedPromise(id,
        _ => check(_ => !!controlMapRef.current.get(id.toString()))
            .then(_ => fnc(...params)));

    if (promise.status === 'fulfilled') {
        return promise.value;
    } else if (promise.status === 'rejected') {
        throw promise.reason;
    } else if (promise.status === 'pending') {
        throw promise;
    } else {
        promise.status = 'pending';
        //console.log("pending",id,controlMapRef);
        promise.then(
            result => {
                promise.status = 'fulfilled';
                promise.value = result;

            },
            reason => {
                promise.status = 'rejected';
                promise.reason = reason;
            },
        );
        throw promise;
    }
}

const SuspenseItem = ({Comp, fetch, item, controlMapRef}) => {
    const imgDataURL = use(item.uuid, controlMapRef, fetch, item);
    return (
        <>
            <Comp resource={item} image={imgDataURL}/>
        </>
    )
};

const Container = forwardRef(({ onDelete, products, controlMapRef, fetch, binNum,children}, ref) => {
    const _initArr = length => Array.apply(null, Array(length)).map(_ => ([]));
    const allProductsRef = useRef([]);
    const {Dummy, Comp, Wrap} = useContext(MasonryContext);

    const [bins,setBins] = useState(_initArr(binNum));



    const findShortColIndex = (parent) => {
        const cols = [...parent.childNodes];
        const colArr = cols.map((container, index) => (
            {
                index,
                height: [...container.childNodes].reduce((acc, cur) => acc += cur.getBoundingClientRect().height, 0)
            }));
        const sorted = colArr.sort((a, b) => (a.height - b.height));
        return sorted.map(ele => ele.index);
    }


    const binFilter = (products)=>{
        return products.filter(prod=>!bins.flat().find(ele=>ele.uuid===prod.uuid));
    }

    useEffect(_=>{
        const allProducts = allProductsRef.current;

        if(allProducts.length === 0) return;


        const newBins = [];
        const heightArr = [];
        for(let i=0;i<binNum;i++){
            heightArr.push({index:i,height:0});
            newBins.push([])
        }



        for(let batchIndex = 0; batchIndex<allProducts.length;batchIndex+=binNum){

            const prod = allProducts.slice(batchIndex, binNum);
            const sortedProd =prod.sort((a, b) => b.height - a.height);

            const sortedHeightIndexArr = heightArr.sort((a,b)=>a.height-b.height)
                .map(ele=>ele.index);

            for (const product of sortedProd) {

                const shorterIndex = sortedHeightIndexArr.shift();
                newBins[shorterIndex].push(product);
            }

        }
        setBins(newBins);
    },[binNum]);



    const observerCallback = useCallback((entries,observer)=>{
        debugger;
        for(const {intersectionRatio,target} of entries){
            console.log(target.getAttribute("id"), intersectionRatio);


            observer.unobserve(target);
            const id = target.getAttribute("id");
            debugger;
            if (id){
                console.log(target.getAttribute("id"), 'ready');
                controlMapRef.current.set(id.toString(), true);
            }
        }
    });
    const [observer, setObserver] = useState(new IntersectionObserver(observerCallback,{root:null,rootMargin:'0px',threshold:1}))



    useEffect(() => {
        if(products.length === 0) return;
        
        allProductsRef.current = [... allProductsRef.current,
            ... allProductsRef.current.filter(prod=>!products.find(ele=>ele.uuid===prod.uuid))];
        let indexArr = findShortColIndex(ref.current);

        const sortedProd = [...binFilter(products)].sort((a, b) => b.height - a.height);
        let index = null;
        const binsCpy = JSON.parse(JSON.stringify(bins));
        for (const product of sortedProd) {
            const shorterIndex = indexArr.shift() ?? null;
            if (shorterIndex != null) {
                index = shorterIndex;
                binsCpy[index].push(product);
            } else {
                const bin = binsCpy[++index % binNum];
                if(bin)
                    bin.push(product);
            }
        }

        setBins( binsCpy);
    }, [products]);

    useEffect(() => {
        for(const bin of ref.current.children) {
            for (const ele of bin.children) {
                observer.observe(ele);
            }
        }
    }, [bins]);


    return (
        <div className="w-full h-full  flex flex-col items-center justify-center">
            <div ref={ref} className="flex gap-8 container mx-auto py-5">
                {
                    bins.map((bin, index) => {
                        return (
                            <div className={`w-1/${binNum} flex flex-col  gap-10`} key={index}>
                                {(bin.map((ele, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <Wrap ele={ele} onDelete={onDelete}>
                                                <Suspense
                                                    fallback={Dummy(ele)}>
                                                    <SuspenseItem item={ele} controlMapRef={controlMapRef}
                                                                  fetch={fetch} Comp={Comp}/>
                                                </Suspense>
                                            </Wrap>
                                        </Fragment>
                                    )}))}
                            </div>)
                    })
                }
            </div>
            {children}
        </div>
    )
})

function Content({root,onRefresh, onDelete, products, offsetY, fetch, binNum}) {
    const [viewOffsetY,] = useState(offsetY);
    const controlMapRef = useRef(new Map());


    const containerRef = useRef(null);
    const containerBottom = useRef(null);
    // const onWheel_clientRects_obsolete = useCallback(() => {
    //             const
    //                 container =  containerRef.current,
    //                 containerBottom = container.getClientRects()[0].bottom,
    //                 totalHeight = window.innerHeight,
    //                 DELTA = 100,
    //                 isBottom = containerBottom - totalHeight < DELTA;
    //
    //             if (isBottom) {
    //                 onRefresh();
    //             }
    //             checkVis( container, controlMapRef, viewOffsetY);}),
    //
    //     onConnect = _ => checkVis( containerRef.current, controlMapRef, viewOffsetY);


    const observerCallback = useCallback((entries,observer)=>onRefresh());

    const [observer, setObserver] = useState(new IntersectionObserver(observerCallback,{root:null,rootMargin:'0px',threshold:0.8}))
    useEffect(_=>{
        if(!containerRef.current||!root||!containerBottom.current) return ;


        observer.observe(containerBottom.current);

        root.addEventListener('scroll', _=>{
            console.log('scroll');
        });
        root.addEventListener('scrollend', _=>{
            console.log('scrollend');
        });
        return () => {
            root.removeEventListener('scroll', onRefresh);
            root.removeEventListener('scrollend', onRefresh);
        }
    },[containerRef.current,root,containerBottom.current]);




    return (
        <Container ref={containerRef} binNum={binNum}
                   onDelete={onDelete}
            // onWheel={_=>onWheel(containerRef.current)}
                   products={products} controlMapRef={controlMapRef}
                   fetch={fetch}>
            <div ref = {containerBottom} className="w-full h-64 bg-sky-500"/>

        </Container>
    )
};
export default  memo(Content);