import keanuFetch from "../../../utils/keanuFetch";
import {getBackendURL} from "../../../utils/reader";
import {apiCatcher} from "../../../utils/apiChecker.js";

const baseURL = getBackendURL();

const _fetch = keanuFetch();





export const createPayPalOrder = () => {
      return fetch(`${baseURL}/pay/paypal/access`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              cart: [{ id: "YOUR_PRODUCT_ID", quantity: "YOUR_PRODUCT_QUANTITY" }],
          }),
      })
      .then(response=>response.json());
}


export const payPalPay = (transaction_arr) => {
    // debugger;
    const url = new URL(`/api/product/pay/paypal`, baseURL);
    return _fetch.post(url, {transaction_arr});
}


export function productPayStripe( uuid, quantity = 1){
    const url = new URL(`/api/product/pay/stripe`, baseURL);
    return _fetch.post(url,{items:[{uuid, quantity}]})

};



// export function productListPay( list){ //[{uuid, quantity}]
//     const url = new URL(`/api/product/pay`, baseURL);
//     return fetch.post(url,{items:list})
// };

export function getProductDetails(uuid){
  const url = new URL(`/api/product/item/${uuid}`, baseURL);
  return _fetch.get(url);

};

export function checkIn(name, description, unit_amount){
  const url = new URL(`/api/product/checkin`, baseURL);
  return _fetch.post(url, {name, description, unit_amount});
};
export function createTransaction(product_item_arr, item_type='one_time') {
    const url = new URL(`/api/product/transaction`, getBackendURL());
    return _fetch.post(url, {
        product_item_arr,item_type
    })
}

export function updateTransaction(transaction_arr, paymentType,payPalOrderId) {
    const url = new URL(`/api/product/transaction`, getBackendURL());

    return _fetch.put(url, {
        transaction_arr,payment_type:paymentType,paypal_order_id:payPalOrderId
    })
}
