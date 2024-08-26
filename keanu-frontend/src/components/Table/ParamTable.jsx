/*
 * show infer params
 */
// todo: we may need a constant file to define the default params
// todo: we should be able to edit the priority
import {ParamInput} from "../Input";
import {SD_LAYOUT} from "../../constants/LayoutConstant.js";

export default function ParamTable({ params, setParams, maxHeight,type=1,onUpdate }) {
    const handleValueChange = (key, newValue) => {
        setParams({
            ...params,
            [key]: newValue,
        });
        onUpdate();
    };

    return (
        <div className={`overflow-y-auto`} style={{ maxHeight }}>
            {Object.entries(params).map(([key, value]) => (
                <div key={key} className="mb-4">
                    {type & SD_LAYOUT.single ? (
                        <>
                            <div className="font-bold break-words">{key}</div>
                            <ParamInput value={value} onChange={e => handleValueChange(key, e.target.value)} />
                        </>
                    ) : (
                        <div className="flex items-center">
                            <div className="font-bold mr-4">{key}:</div>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleValueChange(key, e.target.value)}
                                className="border p-2 flex-1"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

