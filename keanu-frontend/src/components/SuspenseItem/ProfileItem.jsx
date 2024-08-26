
export default function ProfileItem({resource, image}) {
    const {uuid} = resource;
    return (
        <>
            {
                <div className="flex flex-col py-2">
                    <img className="rounded-lg"
                         src={image} alt='cover'>
                    </img>
                </div>
            }
        </>
    )
}