import CartModal from "../components/Cart/CartModal.jsx";
import {useEffect, useState} from "react";

const PaymentReturn = () => {
    const [modalIsOpen, setModalIsOpen] = useState(true);

    useEffect(() => {
        debugger;

    },[]);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);


    return        (<> {modalIsOpen && (<CartModal closeModal={closeModal} initState={4}/>)}</>)

}
export default PaymentReturn;