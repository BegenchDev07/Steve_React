
export default function BazaarItem({resource, image}) {
    // const {width, height} = resource;    
    return (
        <>
            {
                <div className="flex flex-col py-2 w-full h-auto">
                    <img className="rounded-lg h-full object-fit "
                         src={image} alt='cover'>
                    </img>
                </div>
            }
        </>
    )
}