import {forwardRef, memo, useEffect, useImperativeHandle, useState} from "react";
import {
    productPayStripe,
    getProductDetails,
    createTransaction,
    createPayPalOrder,
    updateTransaction, payPalPay
} from "../../services/API/cart";

import {useAppDispatch} from "/src/redux/hooks";
// import {stripePromise} from "../Cart/CartModal.jsx";
// import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import {apiCatcher} from "../../utils/apiChecker.js";
import {LottieAnimation} from "../Lottie/index.jsx";
import ghLoading from "../../assets/lottie/logo.json";
import { ModalLayout } from "../../layouts";
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";

import PayPalSVG from '../../assets/icons/paypal.svg'
// import StripeSVG from '../../assets/icons/3rdParties/stripe.svg'
import { useParams } from "react-router-dom";




const  STATE = {init: 1, stripe: 2, paypal:4, success: 8, loading:16, choice: 32, update:64};

const stateLabelValues = [
    { 'label':'Alabama', 'value': 'AL' },
    { 'label':'Alaska', 'value': 'AK'},
    { 'label':'American Samoa', 'value': 'AS'},
    { 'label':'Arizona', 'value': 'AZ'},
    { 'label':'Arkansas', 'value': 'AR'},
    { 'label':'California', 'value': 'CA'},
    { 'label':'Colorado', 'value': 'CO'},
    { 'label':'Connecticut', 'value': 'CT'},
    { 'label':'Delaware', 'value': 'DE'},
    { 'label':'District of Columbia', 'value': 'DC'},
    { 'label':'States of Micronesia', 'value': 'FM'},
    { 'label':'Florida', 'value': 'FL'},
    { 'label':'Georgia', 'value': 'GA'},
    { 'label':'Guam', 'value': 'GU'},
    { 'label':'Hawaii', 'value': 'HI'},
    { 'label':'Idaho', 'value': 'ID'},
    { 'label':'Illinois', 'value': 'IL'},
    { 'label':'Indiana', 'value': 'IN'},
    { 'label':'Iowa', 'value': 'IA'},
    { 'label':'Kansas', 'value': 'KS'},
    { 'label':'Kentucky', 'value': 'KY'},
    { 'label':'Louisiana', 'value': 'LA'},
    { 'label':'Maine', 'value': 'ME'},
    { 'label':'Marshall Islands', 'value': 'MH'},
    { 'label':'Maryland', 'value': 'MD'},
    { 'label':'Massachusetts', 'value': 'MA'},
    { 'label':'Michigan', 'value': 'MI'},
    { 'label':'Minnesota', 'value': 'MN'},
    { 'label':'Mississippi', 'value': 'MS'},
    { 'label':'Missouri', 'value': 'MO'},
    { 'label':'Montana', 'value': 'MT'},
    { 'label':'Nebraska', 'value': 'NE'},
    { 'label':'Nevada', 'value': 'NV'},
    { 'label':'New Hampshire', 'value': 'NH'},
    { 'label':'New Jersey', 'value': 'NJ'},
    { 'label':'New Mexico', 'value': 'NM'},
    { 'label':'New York', 'value': 'NY'},
    { 'label':'North Carolina', 'value': 'NC'},
    { 'label':'North Dakota', 'value': 'ND'},
    { 'label':'Northern Mariana Islands', 'value': 'MP'},
    { 'label':'Ohio', 'value': 'OH'},
    { 'label':'Oklahoma', 'value': 'OK'},
    { 'label':'Oregan', 'value': 'OR'},
    { 'label':'Palau', 'value': 'PW'},
    { 'label':'Pennsilvania', 'value': 'PA'},
    { 'label':'Puerto Rico', 'value': 'PR'},
    { 'label':'Rhode Island', 'value': 'RI'},
    { 'label':'South Carolina', 'value': 'SC'},
    { 'label':'South Dakota', 'value': 'SD'},
    { 'label':'Tennessee', 'value': 'TN'},
    { 'label':'Texas', 'value': 'TX'},
    { 'label':'Utah', 'value': 'UT'},
    { 'label':'Vermont', 'value': 'VT'},
    { 'label':'Virgin Islands', 'value': 'VI'},
    { 'label':'Virginia', 'value': 'VA'},
    { 'label':'Washington', 'value': 'WA'},
    { 'label':'West Virginia', 'value': 'WV'},
    { 'label':'Wisconsin', 'value': 'WI'},
    { 'label':'Wyoming', 'value': 'WY'}
    ];

function _DirectPay({onPayComplete},ref) {


    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [productItemUUID, setProductItemUUID] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [state, setState] = useState(null);
    const [payType, setPayType] = useState(null);
    const [itemType, setItemType] = useState(false);
    const [transactionArr, setTransactionArr] = useState(null);
    const dispatch = useAppDispatch();

    const [payPalOrderId,setPayPalOrderId] = useState(null);





    //todo: is it safe to hardcode it here?
    const paypalInit = {
        clientId: "AfV9VlxMT4X8m_pJ2aCQ_0N-ev1IIfdOwyBIAjBmcp_COD-D77LVV_EqX-p_lNgfCEahJpSUMNwRPDDb",
    };

    useImperativeHandle(ref, () => ({
        initPay: (uuid,quantity,type) => {            
            setModalIsOpen(true);
            setState(STATE.loading);
            setProductItemUUID(uuid);
            setItemType(type);
            return apiCatcher(dispatch, createTransaction,[{uuid,quantity}])
                .then((transactionArr)=>{
                    setTransactionArr(transactionArr.map(({uuid})=>({uuid})));
                    setState(prev=>prev^STATE.loading);
                    setState(STATE.choice);
                });},

        query:(uuid)=>{
            return apiCatcher(dispatch, getProductDetails, uuid)
        },
        openModal: () => setModalIsOpen(true),
        closeModal: () => {
            // debugger;
            setModalIsOpen(false);
        },

    }), []);

    const stripePay = () => {
        setPayType('stripe');
        setState(STATE.loading);
            setModalIsOpen(true);
            apiCatcher(dispatch, productPayStripe, productItemUUID).then(
                (value) => {
                    setClientSecret(value.secret);
                    setState(STATE.stripe);
                }
            );
    }
    const paypalPay = () => {
        setPayType('paypal');
        setState(STATE.loading);
        setModalIsOpen(true);
        setState(STATE.paypal);
    }

    const options = {
        clientSecret, onComplete: _ =>{
            setState(prev=>prev|STATE.update);
        }
    },    payFinish = ()=>{
            onPayComplete(productItemUUID);
    };


    useEffect(_=>{
        if(state & STATE.update){
            setState(prev=>prev^STATE.update);
            apiCatcher(dispatch,updateTransaction, transactionArr, payType,payPalOrderId)
                .then(_=> {                    
                    return payFinish()
                })
                .then(_=>{
                    debugger;
                    setState(prev=>prev|STATE.success);
                });
        }
    }, [state])



    const renderStripeLayout = _ => (<>

        <div className="w-full h-full py-2">
            <h1 className="py-2 w-full text-center">Checkout</h1>
            <div className="py-5">
                <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={options}
                >
                    <EmbeddedCheckout/>
                </EmbeddedCheckoutProvider>
            </div>
        </div>
    </>);

    // get paypal order id
    const getOrderId = _=>apiCatcher(dispatch,payPalPay,transactionArr).then(
        ({id})=>{
            // todo: need to save this to database
            setPayPalOrderId(id);
            return id;
        });

    const renderPaypalLayout = _ => (<>

        <div className="w-full h-full flex items-center justify-center">
            <PayPalScriptProvider options={paypalInit}>
                <PayPalButtons
                    createOrder={getOrderId}
                    onApprove={_=>{
                        setState(prev=>prev|STATE.update);
                    }}
                />
            </PayPalScriptProvider>
        </div>
    </>);

    const renderChoice = () => {
        return (
            <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
                <h1 className="text-center font-semibold">Please choose your payment method</h1>
                <button onClick={()=>{paypalPay()}} className="flex items-center border border-gray-400 px-1 rounded-lg">
                    <img src={PayPalSVG} alt="" />
                </button>
                {/*<button onClick={()=>{stripePay()}} className="flex items-center border border-gray-400 px-1 rounded-lg">*/}
                {/*    <img src={StripeSVG} alt="" />*/}
                {/*</button>*/}
            </div>
        )
    }
    const renderSuccess = () => {
        // debugger;
        return (
            <form className="w-full h-full flex flex-col items-center justify-center gap-5" method="post">
                {/* <div className="w-full h-full flex flex-col items-center justify-center gap-3"> */}
                    <div className="flex flex-col w-2/4 gap-3">
                        <label className="font-semibold text-xl">Receiver</label>
                        <input placeholder="Receivers name or Company name" className="border-2 px-2 py-2 rounded-xl" type="text" required/>
                    </div>
                    <div className="flex flex-col w-2/4 gap-3">
                        <label className="font-semibold text-xl">City</label>
                        <input placeholder="Street, apt number / room number" className="border-2 px-2 py-2 rounded-xl" type="text" required/>
                    </div>
                    <div className="flex gap-5 w-2/4">
                        <div className="w-1/2 flex flex-col gap-3">
                            <label className="font-semibold text-xl">City</label>
                            <input placeholder="City name" className="border-2 px-2 py-2 rounded-xl" type="text" required/>
                        </div>
                        <div className="w-1/2 flex flex-col gap-3">                    
                            <label className="font-semibold text-xl">State</label>
                            <select className="py-2 border-2 rounded-xl px-2 " required>
                                {
                                    stateLabelValues.map((ele) => {
                                        return (
                                            <option value={ele.value}>{ele.label} - {ele.value}</option>
                                        )
                                    })
                                }
                            </select>                
                        </div>                
                    </div>
                    <button
                    className="px-3 py-1 border-2 bg-blue-600 text-white border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white hover:border-transparent"
                    onClick={_=> setModalIsOpen(false)}
                    >Confirm</button>
                {/* </div> */}
            </form>

        )
    }


    const renderLottieLayout = _ => (
        <LottieAnimation autoplay={true} width={800} height={600} animationData={ghLoading}/>
    );

    const renderState = () => {
        // debugger;
        if(state &STATE.success && itemType){
            // itemType
            // debugger;
            return(
                <ModalLayout>
                   {
                       renderSuccess()
                   }
                </ModalLayout>
            )
        } else {
            switch (state) {                        
                case state&STATE.choice:
                    return(
                        <ModalLayout>
                            {
                                renderChoice()
                            }
                        </ModalLayout>
                    )
                case state&STATE.loading:
                    return(
                        <ModalLayout>
                            {
                                renderLottieLayout()
                            }
                        </ModalLayout>
                    )
    
                case state&STATE.stripe:
                    return(
                        <ModalLayout>
                            {
                                renderStripeLayout()
                            }
                        </ModalLayout>
                    )
                case state&STATE.paypal:
                    console.log("paypal");
                    return(
                        <ModalLayout>
                            {
                                renderPaypalLayout()
                            }
                        </ModalLayout>
                    )
    
    
            }
        }


    }

    return (
        <>                
                {
                    modalIsOpen 
                    &&
                    renderState()
                }
        </>
    );
};


export const DirectPay =  forwardRef(_DirectPay)
