import {useEffect, useState} from "react";
import {getProductDetails} from "../../services/API/cart";
import CartModal from "./CartModal.jsx";
import {MdOutlineShoppingCart} from "react-icons/md";

const MockCart = [
    //{uuid:'12345678',product:"prod_Q9BVORWmnGLUiM",price: "price_1PIt8eBcJlniOQfiPVjzkqh5", quantity: 1, resourceLink: ""},
 ]

// interface Product {
//   price: string;
//   quantity: number;
//   checked?: boolean;
//   resourceLink:string;
//   images?: string[];
//   currency?:string;
//   description?:string;
//   name?:string;
//   unit_amount?:number;
//   type?: "one-time"|"recurring"
// }

export default function Cart() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [products, setProducts] = useState([]);

    const queryPrice = cartData => {
        return Promise.all(cartData.map((product) => {
            product.checked = false;
            getProductDetails(product.uuid).then(res => {
                const {currency, description, name, unit_amount, images, type} = res;
                product.currency = currency
                product.description = description
                product.name = name
                product.unit_amount = unit_amount
                product.images = images
                product.type = type
            })
            return product;
        }))
    }

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);


    useEffect(() => {
        queryPrice(MockCart).then(products => setProducts(products));
    }, []);

    return (
        <>
            <button onClick={openModal}>
                <MdOutlineShoppingCart size={24}/>
            </button>
            {modalIsOpen && (<CartModal products={products} closeModal={closeModal}/>)}
        </>
    );
};