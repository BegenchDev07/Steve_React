import GHLoading from "../GHLoading/index.jsx";

export default function ProfileDummy(resource) {
    const {width, height} = resource;

    return (
        <>
            {
                <div className="flex flex-col">
                    <div className="hover:cursor-pointer flex items-center justify-center bg-gray-300" >
                        <GHLoading width={width} height={height}/>
                    </div>
                </div>
            }
        </>
    )
}