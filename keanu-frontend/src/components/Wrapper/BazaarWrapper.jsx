import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import LikeSVG from '../../assets/icons/floatingMenu/like.svg'
import SubsSVG from '../../assets/icons/floatingMenu/subs.svg'
import AvatarImage from "../AvatarImage";

export default function BazaarWrapper({children, ele}) {
    const navigator = useNavigate();
    const {title, username, uuid,create_time,feedback = null, product=null, description} = ele;    
    const [renderProduct, setRenderProduct] = useState(null);
    const date = new Date(create_time).toDateString()
    const [currencies, setCurrencies] = useState({'USD':'$', 'HKD':'HK$'})
    

    const checkForDonation = (value) => {
        // const clone = value
        const ref = value.product.product_item.filter(ele => ele.unit_amount !== 1 && ele.unit_amount)
        if(ref.length != 0){
            value.product.product_item = ref
            // debugger;
            setRenderProduct(value)
        }
    }

    const priceRange = (data) => {
        const ref = Object.values(data.product.product_item).map((ele) => 
        {
            if(ele.unit_amount === "Free" || ele.unit_amount === 0)
                return {unit_amount:"Free", currency: currencies[ele.currency.toUpperCase()]}            
            else 
                return {unit_amount: ele.unit_amount / 100, currency: "USD"}                    
        }).sort((a,b)=> a.unit_amount - b.unit_amount)      
        
        // ref.sort((a,b) => a.unit_amount - b.unit_amount)
        // debugger;                

        return (
            <>            
                <p>
                    {ref.at(0).unit_amount}
                </p>
                <p>
                    {ref.at(0).currency}
                </p>
            </>
        )
    }

    useEffect(()=>{
        checkForDonation(ele)
    },[])
    return (
        <>
        {
            (renderProduct)
            &&
            <div        
            id={uuid}
            className="w-full h-auto flex flex-col"
            >
                <div className="bg-gray-200 rounded-lg p-3">
                    <div className="w-auto h-auto bg-gray-300 rounded-lg">
                        <Link to={`/@${renderProduct.username}/${renderProduct.uuid}`} >
                            {children}
                        </Link>
                    </div>
                    <div className="w-auto h-auto pt-2 flex gap-3 font-bold hover:cursor-pointer">
                        <div className="w-1/2">
                            <button onClick={() => navigator(`/@${username}/${uuid}`)}>
                                <h3>
                                    {title}
                                </h3>
                            </button>
                            <p className="text-sm font-thin">
                                {date}
                            </p>
                        </div>
                        <div className="w-1/2 flex items-center justify-end">
                        {/* <div className="flex items-center justify-center gap-3 w-full"> */}
                            <div className='flex gap-1 items-center justify-center'>
                                <img src={LikeSVG} alt="" />                        
                                {
                                    (feedback)
                                    &&
                                    <p className='px-0.5'>{feedback.like}</p>                            

                                }
                            </div>
                            <div className='flex gap-1 items-center justify-center'>    
                                <img src={SubsSVG} alt="" />                        
                                {
                                    (feedback)
                                    &&                            
                                    <p className='px-0.5'>{feedback.subscribe}</p>                            
                                }
                            </div>
                        {/* </div>  */}
                        </div>
                    </div>
                    <div className="w-full flex line-clamp-3 pb-2">
                        {renderProduct.description}
                    </div>
                    <div className="w-full flex items-center justify-center"> 
                        <div className="w-1/2 flex gap-2 items-center">
                            <AvatarImage avatar={renderProduct.username} width={8}/>
                            <p className="capitalize text-xl font-semibold">{renderProduct.username}</p>
                        </div>
                        <div className="w-1/2 flex items-center justify-end">
                            <button className="w-auto bg-lime-500 flex items-center justify-center h-full rounded-lg w-auto">
                                
                                <nobr className="w-full flex bg-lime-600/50 rounded-lg p-1 gap-2 text-white">
                                    {                                    
                                        priceRange(renderProduct)
                                    }
                                    {/* <p>{(product.product_item.at(0).unit_amount / 100)} - {(product.product_item.at(-1).unit_amount / 100)} </p> */}
                                    {/* <p className="uppercase">{(product.currency) ? currencies[product.currency.toUpperCase()] : "USD"}</p> */}
                                </nobr>                            
                                                            
                                    
                                    <div className="w-full flex items-center justify-center px-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                                    </div>                            
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    )
}