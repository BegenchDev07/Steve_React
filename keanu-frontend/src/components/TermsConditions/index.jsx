import {driver} from "driver.js";
import {useEffect, useRef} from "react";
import CommunityRuleAni from "../CommunityRuleAni/index.jsx";
import rulePost from "../../assets/lottie/rulePost.json";

import {LottieAnimation} from "../Lottie/index.jsx";
import ghLoading from "../../assets/lottie/logo.json";


export const POST_CONDITION = `
1. Ownership of Original Resources User retains all rights, including copyright, in any original art resources ("Resources") shared on the Gamehub platform. User hereby grants Gamehub a non-exclusive, worldwide, royalty-free license to use, reproduce, distribute, and display the Resources solely for the purpose of operating the Gamehub platform.
2. Use of Resources Other users of the Gamehub platform ("Users") may freely use the Resources shared by User solely within the Gamehub platform for the creation of games, game-related content, or any other purpose related to the functionality of the Gamehub platform.
3. Restrictions Any product used Free Art Resources of Gamehub, but published outside of Gamehub,  must prominently display a credit to User's name and the Gamehub logo.
4. Additional Restrictions a. Users may not use the Resources shared by User outside of the Gamehub platform for any purpose that is political, racist, or otherwise discriminatory. b. All public topics, game projects, and art Resources shared on the Gamehub platform must adhere to civil standards and may not promote political agendas, racism, or discrimination in any form.
`;




const TermsConditions = ({onComplete}) => {

    const driverObj = new driver({
        showProgress: true,
        steps: [
            {
                element: '#terms1',
                popover: {
                    title: 'Attention!',
                    description: 'Please read carefully'
                }
            },
            {
                element: '#cancel',
                popover: {
                    title: 'Attention!',
                    description: 'If you do not agree then press "Cancel" button. But then you are not allowed to take further actions'
                }
            },
            {
                element: '#accept',
                popover: {
                    title: 'Attention!',
                    description: 'If you agree press "Accept" button and continue your journey with us !'
                }
            },
            
        ],
        // onDestroyStarted: () => {
        //     if (!driverObj.hasNextStep() || confirm("Are you sure?")) {
        //         onComplete()
        //         driverObj.destroy();
        //     }
        // },
    })

    const ref = useRef(null);
    useEffect(() => {
        driverObj.drive();
    }, []);


    return (
        <>
            {/*<LottieAnimation autoplay={true} width={800} height={600} animationData={ghLoading}/>*/}
            <div className="w-auto flex flex-col gap-3 rounded-md text-red-800 bg-red-300/50 h-auto px-3 py-3 ">
                <div id="terms1" className="px-1 py-1 flex gap-3 flex flex-col">
                    <h2> 1. Ownership of Original FREE Art Resources User retains all rights, including copyright, in
                        any original art resources ("Resources") shared on the Gamehub platform. User hereby grants
                        Gamehub a non-exclusive, worldwide, royalty-free license to use, reproduce, distribute, and
                        display the Resources solely for the purpose of operating the Gamehub platform.</h2>
                    <h2> 2. Restrictions Users may not use the Resources shared by User outside of the Gamehub platform
                        without prior written consent from User. Any such use outside of the Gamehub platform must
                        prominently display a credit to User's name and the Gamehub logo.</h2>
                    <h2> 3. Additional Restrictions <br/> <b> a. Users may not use the Resources shared by User outside
                        of the Gamehub platform for any purpose that is political, racist, or otherwise
                        discriminatory. </b> <br/> <b> b. All public topics, game projects, and art Resources shared on
                        the Gamehub platform must adhere to civil standards and may not promote political agendas,
                        racism, or discrimination in any form.</b></h2>
                </div>
                <div>

                </div>
                <div className="w-full flex text-white justify-end items-center gap-3">
                    <button id="cancel" className="w-auto px-1 py-0.5 bg-gray-500 rounded">Cancel</button>
                    <button id="accept" className="w-auto px-1 py-0.5 bg-blue-500 rounded" onClick={(e) => {
                        onComplete();
                    }}>Accept
                    </button>
                </div>
            </div>
        </>
    )
}

export default TermsConditions;