import TreeView from "../TreeView";

export default function Outliner({project='test-Test', data, onOpen, onChange}){

    const _open = (id,url)=>{
            if(onOpen)
                onOpen(id,url)
        },
        _change = path=>{if(onChange) onChange(path)};

    return (
        <>
            <div className="w-full h-full flex flex-col px-4">
                <div className="w-full">
                    <TreeView ref={ref} project={project} data={data} onOpen={_open} onChange={_change}/>
                </div>

            </div>
        </>
    )
}