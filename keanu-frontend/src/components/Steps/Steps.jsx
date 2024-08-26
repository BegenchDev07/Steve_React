import {useAppSelector} from "/src/redux/hooks";
import {useState, useEffect} from "react";

export default function Steps({uuid, container, gifList,nameList }) {
    const [stepIndex, setStepIndex] = useState(0);

    const menuState = useAppSelector((state) => state.menu);

    const handleClick = (index) => {
        setStepIndex(index);
    }

    const renderTitle = () => {
        let name = (Number(uuid) === 0) ? 'Create' : 'Edit';
        return (
            <div className="flex w-full pb-2">
                <div className="w-1/3">
                    <h1 className="text-4xl font-light">{name}</h1>
                </div>
                <div className="w-2/3">
                </div>
            </div>
        );
    }

    const renderStepCounter = (step, index) => {
        return (
            <div key={index} className="w-1/3 text-start flex gap-3">
                <div className="w-full flex">
                    <div className="flex flex-col w-full items-center gap-3 cursor-pointer" onClick={() => handleClick(index)}>
                        <span className={`text-center text-xl ${stepIndex === index ? 'font-semibold text-blue-500 border-b-2 border-blue-500' : ''}`}>
                            {index + 1}. {nameList[index]}
                        </span>
                        <div className="flex" key={index}>
                            <img src={gifList[index]} className="w-44 h-26" alt="" />
                        </div>
                    </div>
                    <div className="w-1/2 flex justify-center items-center">
                        {
                            (container.length !== index + 1)
                            && <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" strokeWidth={1.5}
                                    stroke="currentColor" className="w-6 h-6 ">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        }
                    </div>
                </div>
            </div>
        );
    }

    const renderSection = () => {
        const Comp = container[stepIndex];
        return (<Comp uuid={uuid}/>)
    }

    useEffect(() => {
        switch (menuState.value) {
            case 'prev':
                if (stepIndex > 0) {
                    setStepIndex(prev => prev - 1);
                }
                break;
            case 'next':
                if (stepIndex < container.length - 1) {
                    setStepIndex(prev => prev + 1);
                }
                break;
            case 'update':

            default:
                break;
        }
    }, [menuState]);


    useEffect(() => {
        return ()=>{
            setStepIndex(0);
        }
    }, []);

    return (
        <div className="flex flex-col p-8 mx-auto w-full">
            {renderTitle()}

            <div className="w-full">
                <div className="h-auto flex items-center justify-center">
                    {nameList.map((step, index) => renderStepCounter(step, index))}
                </div>
            </div>
            <div className="w-full flex gap-5 items-center pt-10">
                <div className="col-span-1 col-start-1 w-full">
                    {renderSection()}
                </div>
            </div>
        </div>
    )
}