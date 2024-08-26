import { Fragment, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { apiCatcher } from "../utils/apiChecker";
import { useAppDispatch } from "../redux/hooks.js";
import { getTransactionHistory } from "../services/API/history";
import StripeSVG from '../assets/icons/3rdParties/stripe.svg';
import PayPalSVG from '../assets/icons/paypal.svg';
import { refreshTransactionStatus } from "../services/API/transaction/transaction";



const PurchaseHistory = () => {
    const [transactions, setTransactions] = useState(null);
    const [flag,setFlag] = useState(false);
    const dispatch = useAppDispatch();

    const fetchData = _ => {
        apiCatcher(dispatch,getTransactionHistory)
            .then((result)=>{
                // debugger
                setTransactions(result)
            })
    }

    const statusHandler = (status) => {
        switch(status){
            case 'success':
                return(<p className="text-green-600">Success</p>)
            case 'in progress':
                return(<p className="text-yellow-500">In Progress</p>)            
            case 'invalid':
                return(<p className="text-red-500">Invalid</p>)            
        }
    }


    const definePayment = (status, type) =>{
        if(status === 0){
            return(
                <h3 className="font-bold text-gray-400">NULL</h3>
            )
        } else {
            if(type === 'stripe'){
                return(
                    <img className="h-8" src={StripeSVG} alt="" />
                )
            } else {
                return (
                    <img className="h-8" src={PayPalSVG} alt="" />
                )
            }
        }
    }

    const handleExpand = (id) => {
        if(document.getElementById(id).classList.contains('hidden'))
            document.getElementById(id).classList.replace('hidden','visible')
        else
            document.getElementById(id).classList.replace('visible','hidden')
    }

    const convertToDateString = (date) => {
        let x = new Date(date);
        return x.toGMTString().split('GMT')[0]
    }

    const handleRefresh = (transaction_uuid) => {
        apiCatcher(dispatch,refreshTransactionStatus,transaction_uuid)
        .then((result)=>{
            setFlag(!flag);
        })
    }

    useEffect(() => {
        fetchData();
    }, [flag]);

    return (
        <div className="px-4 py-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                {transactions && transactions.map((transaction, index) => (
                    <Fragment key={index}>
                        <div className="bg-white shadow-md rounded-lg mb-6">                            
                            <div className="flex items-center justify-between bg-gray-100 px-6 py-4 rounded-t-lg">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center text-gray-600">
                                            {definePayment(transaction.total_amount)}
                                    </span>
                                    <span className="flex-row">                                                                        
                                    </span>
                                    <span className="text-gray-600">Order ID: {transaction.uuid}</span>
                                    <span className="text-gray-600">${transaction.total_amount}</span>
                                    {/* <span className="text-gray-600">Type: {transaction.type}</span> */}                                    
                                    <span className="text-gray-600">
                                         
                                        <p className="font-bold text-lg text-dark capitalize">
                                            {statusHandler(transaction.status)}
                                        </p>
                                    </span>   
                                    <span
                                        className="text-gray-600">{convertToDateString(transaction.created_time)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-5 justify-center">
                                    {
                                        (transaction.status !== "success")
                                        ?
                                        <button 
                                        onClick={_=>handleRefresh(transaction.uuid)}
                                        className="flex text-lg font-semibold items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg">
                                            Refresh
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                                        </button>
                                        :
                                        <button className="flex text-lg font-semibold items-center gap-2 px-3 py-1 bg-lime-500 text-white rounded-lg">
                                            Refund
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ticket-x"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="m9.5 14.5 5-5"/><path d="m9.5 9.5 5 5"/></svg>
                                        </button>
                                    }                                    
                                    {/* <button onClick={() => handleExpand(index)}
                                            className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round" className="lucide lucide-chevron-down">
                                            <path d="m6 9 6 6 6-6"/>
                                        </svg>
                                    </button> */}
                                </div>
                            </div>
                            
                            <div id={index} className="visible px-6 py-4 bg-white border-t rounded-b-lg border-gray-200">
                                {
                                (transaction.products.length !== 0)
                                ?
                                transaction.products.map((product, productIndex) => (
                                    <div key={productIndex} className="mb-4 last:mb-0">
                                        <div
                                            className="flex items-center justify-between bg-gray-200 px-4 py-2 rounded-lg">
                                            <span className="text-gray-700">Product ID: {product.uuid}</span>
                                            <span className="flex gap-1"> by 
                                                <a className="underline hover:text-blue-600" href={`/@${product.username}`}>
                                                    @{product.username}
                                                </a>
                                            </span>
                                        </div>
                                        <div className="mt-2 pl-4">
                                                <div className="flex gap-1 items-center">
                                                    <p>
                                                        Title: 
                                                    </p>
                                                <Link to={product.url} className="flex items-center gap-2 text-gray-600 no-underline hover:underline hover:text-blue-600 font-semibold">
                                                    <p>
                                                        {product.title}
                                                    </p>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                                                </Link>
                                                </div>
                                            <p className="text-gray-600 mt-1 font-semibold">Description: {product.description}</p>
                                        </div>
                                        <div className="mt-2 pl-4">                                    
                                            <span className="text-gray-600 capitalize font-semibold">Type: {product.type}</span>
                                        </div>
                                    </div>
                                ))
                                :
                                <div className="w-full flex items-center justify-center">
                                    <p className="font-semibold text-xl text-gray-400/70">Empty !</p>
                                </div>
                            }
                            </div>
                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default PurchaseHistory;