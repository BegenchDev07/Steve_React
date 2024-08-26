// todo: may change the style to tailwindcss
import {ZINDEX_APP_MODAL} from "/src/constants/StyleConstants"

const ModalLayout = ({children, closeModal}) => {
    return (
        <div className="overlow-y-hidden h-auto scrollbar-hide">
            {/* Overlay */}
            <div
                className="overflow-y-hidden fixed top-0 left-0 right-0 bottom-0 bg-black opacity-60 z-50"
                onClick={closeModal}
            />

            {/* Modal content */}
            <div
                // className="overflow-y-hidden overflow-x-none scrollbar-hide"
                className="scrollbar-hide overflow-none"
                style={{
                    position: "fixed",
                    top: '5%',
                    left: '20%',
                    right: '20%',
                    bottom: '10%',
                    background: "white",
                    borderRadius: "20px",
                    zIndex: ZINDEX_APP_MODAL
                }}>
                {children}
            </div>
        </div>
    );
};

export default ModalLayout;
