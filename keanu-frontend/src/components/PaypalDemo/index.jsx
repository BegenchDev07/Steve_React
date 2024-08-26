import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import {getBackendURL} from "../../utils/reader";
const baseURL = getBackendURL();
export default function App() {
    const initialOptions = {
        clientId: "AVIE6ovAKpUVWx2sQCaoXV8bi8FMK9Lqh3BxuJanIEzbIlYmH4Bd0qBWga9spGK5NFK9hJ1x0BM4Cm9a",
    };

    const createOrder = async () => {
        try {
            const response = await fetch(`${baseURL}/pay/paypal/access`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cart: [{ id: "YOUR_PRODUCT_ID", quantity: "YOUR_PRODUCT_QUANTITY" }],
                }),
            });
            const orderData = await response.json();

            if (!orderData.value.id) {
                const errorDetail = orderData.value.details[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.value.debug_id})`
                    : "Unexpected error occurred, please try again.";

                throw new Error(errorMessage);
            }

            return orderData.value.id;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return (
        <div className="App">
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    createOrder={createOrder}
                />
            </PayPalScriptProvider>
        </div>
    );
}
