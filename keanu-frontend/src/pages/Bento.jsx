const Bento = () => {
     

    return (
        
        <div className="w-full h-full container mx-auto py-4 flex flex-col gap-5">
            <div className="grid auto-rows-[192px] grid-cols-3 gap-4">
                {[...Array(7)].map((_, i) => (
                    <div
                    key={i}
                    className={`flex w-auto h-auto row-span-1 rounded-md bg-gray-300 ${
                        i === 3 || i === 6 ? "col-span-2" : ""
                    }`}
                    >                        
                    </div>
                ))}
            </div>
            {/* <div className="columns-1 gap-4">
                {[24, 32, 36, 32, 32, 32, 16, 16, 64].map((height, index) => (
                    <div
                    key={index}
                    className={`mb-4 h-${height} break-inside-avoid rounded-xl border-2 border-slate-400/10 bg-neutral-100 p-4 dark:bg-neutral-900`}
                    />
                ))}
            </div> */}
            <hr />
                <div className="flex gap-4">
                {[
                    [24, 32, 32, 16, 16],
                    [32, 40, 56],
                    [64, 32, 32],
                ].map((card, index) => (
                    <div className="flex-1 w-full h-full" key={index}>
                    {card.map((height, index) => (
                        <div
                        className={`mb-4 h-[${height*4}px] rounded-xl border-2 border-slate-400/10 bg-gray-300 p-4`}
                        key={index}
                        ></div>
                    ))}
                    </div>
                ))}
                </div>
        </div>
        
    )

}

export default Bento;