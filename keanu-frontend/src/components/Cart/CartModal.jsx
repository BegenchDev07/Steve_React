// todo: need use masonry for cart item
import {ModalLayout} from "../../layouts"
import ProductImgMock from "../../assets/icons/common/gamehub.svg";

import {useEffect, useState, memo} from "react";
import {useAppDispatch} from "/src/redux/hooks";
import {productPayStripe, getProductDetails} from "../../services/API/cart";
import {useNavigate} from "react-router-dom";
import {apiCatcher} from "../../utils/apiChecker.js";
import {EmbeddedCheckoutProvider, EmbeddedCheckout} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {LottieAnimation} from "../Lottie/index.jsx";
import ghLoading from "../../assets/lottie/logo.json";
import {MdOutlineCancel, MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank} from "react-icons/md";

import {createTransaction} from "../../services/API/cart/index.js";
import keanuFetch from "../../utils/keanuFetch.js";

export const stripePromise = loadStripe("pk_test_51P6B6JBcJlniOQfiIfuqRP6Eak2ScpdmZOPZqfTwrKnfHWO5efpa6l7lHtE1ClnYQt8PgXZJARmimcQ6ye8oM2HB00vreVSEaE");

export const  STATE = {items: 1, stripe: 2, paypal:4, success: 8, loading:16, choice:32};

const fetch = keanuFetch();


const CartModal = ({closeModal, products, initState}) => {
    debugger;
    const [productArray, setProductArray] = useState([]);
    const [state, setState] = useState(initState ?? STATE.items);
    const [clientSecret, setClientSecret] = useState(null);
    // const [paymentState, setPaymentState] = useState(false);
    const [allChecked, setAllChecked] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const options = {
        clientSecret, onComplete: _ =>{
            setState(STATE.success);

            //UserProductPay with status 1 successful
            return createTransaction(productArray[0].uuid, 1);
        }
    };

    const changeProductCheck = (index) => {
        const newCart = [...productArray]; // Use spread operator for faster copy
        newCart[index].checked = !newCart[index].checked;
        setProductArray(newCart);

        // Check if all items are checked in a single loop
        const allChecked = newCart.every(item => item.checked);
        setAllChecked(allChecked);
    };

    const changeAllProductsCheck = () => {
        const newCart = [...productArray]; // Use spread operator for faster copy
        const checked = !allChecked; // Toggle checked state based on current allChecked

        // Update all items in a single loop
        newCart.forEach(item => item.checked = checked);

        setProductArray(newCart);
        setAllChecked(checked);
    };


    // //UserResourcePay with status 0
    // apiCatcher(dispatch, createTransaction,'post',
    //     uuid,`${currentUserName}/.profile/${uuid}/index.json`, title,tags )


    const _checkoutStripe = lineItems=>

            apiCatcher(dispatch, productPayStripe, lineItems).then(
                (value) => {
                    if (value.url) {
                        navigate(value.url)
                    } else {
                        setClientSecret(value.secret);
                        //from shoppingCart to

                        setState(STATE.stripe);
                    }
                }
            );

    const checkout = evt => {
        const lineItems = productArray.filter(item => item.checked).map(item => ({
            //uuid:item.uuid,
            price: item.price,
            quantity: item.quantity
        }));
        return createTransaction(productArray[0].uuid, 0)
            .then(_=> _checkoutStripe(lineItems));
    }

    const renderProduct = (product, index) => {
        return (
            <div className="flex items-center p-2 border border-gray-200 rounded-md">
                <button
                    onClick={() => {
                        changeProductCheck(index);
                    }}
                    className="focus:outline-none mr-4"
                >
                    {product.checked ? (
                        <MdOutlineCheckBox className="text-blue-500"/>
                    ) : (
                        <MdOutlineCheckBoxOutlineBlank className="text-gray-400"/>
                    )}
                </button>
                <div className="flex flex-grow">
                    <img
                        className="w-26 h-24 rounded-lg object-cover mr-4"
                        src={product.images ? product.images[0] : ProductImgMock}
                        alt={product.name}
                    />
                    <div className="flex flex-col justify-between">
                        <div className="text-base font-semibold mb-2">
                            {product.name}
                        </div>
                        <div className="text-sm text-gray-500 w-40 overflow-hidden white-space-nowrap">
                            {product.description}
                        </div>
                        <div className="flex items-center mt-2">
                            <div
                                className="cursor-pointer text-sm font-medium text-blue-500 hover:underline"
                                onClick={() => {
                                    navigate(product.resourceLink);
                                }}
                            >
                                Detail Page &gt;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCartLayout = _ => (
        <>
        <CartHolder>
              <div className="w-full h-full p-5 text-left">
                <div
                    className="flex flex-col gap-3 no-scrollbar h-85vh mx-5 overflow-y-scroll">
                    {productArray.length === 0 ? <div className="text-center">No items in cart</div> :
                        productArray.map((product, index) => renderProduct(product, index))}
                </div>
            </div>
        </CartHolder>
        </>
        )

    const CartHolder = ({children}) => {
    return(
        <div className="h-auto">
            <div className="w-full sticky top-0 bg-white flex items-center p-3 shadow-md rounded-t-lg">
                <h1 className="w-1/2 flex items-center text-xl font-semibold">
                    Cart
                </h1>
                <button
                className="w-1/2 flex items-center justify-center gap-3"
                onClick={changeAllProductsCheck}>
                    Select All
                    {allChecked ? <MdOutlineCheckBox/> : <MdOutlineCheckBoxOutlineBlank/>}
                </button>
                <button
                    onClick={closeModal}
                    className={"w-1/2 flex items-center justify-end top-5 right-10"}
                >
                    <MdOutlineCancel size={32}/>
                </button>
            </div>
            <div className="overflow-y-scroll">
                {children}
            </div>
            <div className="w-full sticky bottom-0 flex justify-end p-3">
                <button
                    type="submit"
                    className="rounded-md px-5 py-2 border border-gray-400 bg-gray-200 shadow-xl"
                    onClick={checkout}
                >
                    Check out
                </button>
            </div>
        </div>
    )
    }

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
    </>)

    const renderLottieLayout = _ => (
        <LottieAnimation autoplay={true} width={800} height={600} animationData={ghLoading}/>
    );

    useEffect(() => {
        setProductArray(products);
    }, [products])

    return (
        <>
            <ModalLayout closeModal={closeModal}>
                {
                    (_ => {
                        switch (state) {
                            case STATE.items:
                                return renderCartLayout();
                            case STATE.stripe:
                                return renderStripeLayout();
                            case STATE.success:
                                return renderLottieLayout();
                        }
                    })()
                }
            </ModalLayout>
        </>
    );
};
//export default memo(CartModal);
export default CartModal;
