import { useRef } from "react";

export default function ParamInput({value,rows=1, onChange}) {
    const valueAreaRef = useRef(null);

    const handleClick = () => {
        const valueArea = valueAreaRef.current;
        valueArea.style.height = `${valueArea.scrollHeight}px`
    }
    const handleBlur = () => {
        const valueArea = valueAreaRef.current;
        valueArea.style.height = 'auto';
    };

    return (
        <textarea
            className="p-2 rounded-md mr-2 resize-none flex-grow focus:outline focus:border-blue-500 h-auto"
            ref={valueAreaRef}
            value={value}
            rows={1}
            onChange={onChange}
            onFocus={handleClick}
            onBlur={handleBlur}
            placeholder="Enter Value..."
        />
    );
}