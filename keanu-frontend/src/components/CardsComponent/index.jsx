import CartSVG from '../../assets/icons/Cart itself.svg';
import StarSVG from '../../assets/icons/Star.svg';
import HeartSVG from '../../assets/icons/Heart.svg';
import AvatarImage from "../AvatarImage"


const regularize = num=>{
    const str = num.toString();
    if(str.length>4)
        console.log();

}
const CardsComponent = ({
                    product ={
                        uuid:"as;dkfla;jslkdjf;alsk",
                        image:"https://images.pexels.com/photos/866398/pexels-photo-866398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        title:"Product NameProduct NameProduct Name",
                        description:"a;slkdfja;slkdfj;as lkdjf;alskdj f;alskdjf;alskd jf;alskdjf;alskjd f;alsdjf;alskdjf; alskjdf;alskdjf ;alskdjf;alskdjf",
                        price:56.13,
                        createtime: new Date(),
                        updatetime:new Date()},

                    user ={
                        avatar:"",
                        username:"test",},
                    feedback ={
                        collect:21234,
                        like:21392}}) => {

    const {uuid, image, title, createtime, updatetime, description,price} = product,
        {avatar, username} = user;
    let {collect, like} = feedback;


    const
        url =`/resource/${uuid}`,
        time = createtime.toLocaleString('default', { month: 'short', year: "numeric"}),
        isUpdate =!( updatetime === createtime);

    const onClick = evt=>{
        //TODO:redirect
        debugger;

    }, profileClk = evt=>{
        //TODO:redirect
        `/@${username}`
        debugger;
        evt.stopPropagation();
    }, cartClk = evt=>{

        debugger;
        evt.stopPropagation();

    }

    return (
        <>
            <div className="flex flex-col rounded-md bg-gray-200 gap-3" onClick={onClick}>
                <div className="w-auto h-auto">
                    <img className="w-full h-full rounded-t-md object-fit"
                         src={image}
                         alt=""/>
                </div>
                <div className="flex px-2">
                    <div className="flex w-full">
                        <div className="w-1/2 flex items-center">
                            <h2 className="font-semibold text-xl overflow-x-hidden truncate">
                                {title}
                            </h2>
                        </div>
                        <div className="w-1/2 flex items-center justify-end gap-4 pr-5">
                            <div className='flex flex-col items-center justify-center'>
                                <img src={StarSVG} alt="" />                                
                                <p className='text-xs font-light'>{collect}</p>
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                                <img src={HeartSVG} alt="" />
                                <p className='text-xs font-light'>{like}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex items-center justify-start px-2 gap-4">
                    <h3 className="font-semibold">
                        {time}
                    </h3>
                    <p className='text-green-700'>
                        {isUpdate?'update':''}
                    </p>
                </div>
                <div className="w-full px-2">
                    <p className="line-clamp-3 text-sm font-md">
                        {description}
                    </p>
                </div>
                <div className="w-full flex px-2 py-2 items-center">
                    <button className="w-1/2 flex gap-2 items-center" onClick={profileClk}>
                        <AvatarImage width={8}/>
                        <h4 className="overflow-x-hidden truncate">ViktorViktorViktorViktorViktorViktor</h4>
                    </button>
                    <div className="w-1/2 flex items-center justify-end">
                        <button className="flex bg-lime-400 rounded items-center" onClick={cartClk}>
                            <span className="w-full bg-lime-500 rounded px-1 py-1">
                                {`$${price}`}
                            </span>
                            <img className='px-1' src={CartSVG} alt=""/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CardsComponent