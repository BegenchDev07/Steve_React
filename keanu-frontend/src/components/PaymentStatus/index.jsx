import { useEffect } from "react";
import { useParams } from "react-router-dom";
const PaymentStatus = ()=>{
  const {paymentState,redirectURL} = useParams();
  useEffect(()=>{setTimeout(()=>{
    console.log(redirectURL)
    window.location.href = `${window.location.origin}/${redirectURL}`
  },1000)
  },[])
  return <>
    <div style={{fontSize:"32px"}}>
      Payment {paymentState}, redirecting in 5 seconds.
    </div>
  </>
}
export default PaymentStatus;