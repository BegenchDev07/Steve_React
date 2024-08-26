import {useEffect, useState, useRef} from "react";
import {getHotTags} from "../../services/API/tags";
import {apiCatcher} from "../../utils/apiChecker";
import {useAppDispatch} from "../../redux/hooks.js";
import {MdOutlineCancel} from "react-icons/md";
import {getTagType} from "../../assets/icons/tag.jsx";
import {createAlert} from "../../redux/reducers/AlertSlice.js";

export default function Tags({onQuery}) {
    const dispatch = useAppDispatch();

    // we provide some tags by default, but the user can also add custom tags
    const [providedTags, setProvidedTags] = useState(['SAI', '2D', 'Detective', 'Brainstorm', 'GameHub'])
    const [selectedTags, setSelectedTags] = useState([]);

    const customTagInputRef = useRef(null);

    const handleNewCustomTags = () => {
        const newTag = customTagInputRef.current.value;
        if (!providedTags.map(tag => tag.toLowerCase()).includes(newTag?.toLowerCase)) {
            setProvidedTags(prev => ([...prev, newTag]));
        }
    }

    const handleQuery = () => {
        onQuery(selectedTags);
    }

    const handleSelectNewTags = (e) => {
        if (selectedTags.length < 5 && !selectedTags.includes(e.target.value)) {
            const nowTags = [...selectedTags, e.target.value];
            setSelectedTags(nowTags);
        } else {
            dispatch(createAlert({
                type: 'error',
                message: `you can only select 5 tags`,
            }))
        }
    }

    const handleRemoveTag = (data) => {
        const filteredTags = selectedTags.filter(tag => tag !== data);
        setSelectedTags(filteredTags);
    }

    const fetchHotTags = _ => apiCatcher(dispatch, getHotTags, 5)
        .then(res => setProvidedTags(res));

    useEffect(() => {
        fetchHotTags();
    }, []);

    return (
        <div className="flex gap-2 w-1/2 px-2">
            <div className="flex flex-col gap-4 w-1/2">
                <div className="flex gap-2">
                    <label className="font-semibold text-2xl">
                        Tags:
                    </label>
                    <input type="text" name="title" ref={customTagInputRef}
                           className="w-full hover:outline focus:outline px-2 py-0.5" placeholder="Enter the tag"/>
                    <button onClick={handleNewCustomTags}
                            className="border bg-blue-600 text-white rounded-md px-1 pt-1 text-center no-underline cursor-pointer">
                        Add
                    </button>
                    <button onClick={handleQuery}
                            className="border bg-green-600 text-white rounded-md px-1 pt-1 text-center no-underline cursor-pointer">
                        Query
                    </button>
                </div>
                <select
                    className="pt-2 w-full"
                    name="selectTags"
                    multiple={true}
                >
                    {
                        providedTags?.map((ele, index) => {
                            return (
                                <option className={"p-1"} key={index} onClick={handleSelectNewTags}
                                        value={ele}>{ele}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div className="flex w-1/2 justify-center px-2">
                {
                    (selectedTags?.length !== 0) &&
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 justify-items-center self-center">
                        {selectedTags?.map((ele, index) => {
                            return (
                                <span id={index} onClick={() => {
                                    handleRemoveTag(ele)
                                }} className="flex rounded-md border relative p-2">
                            <MdOutlineCancel size={20}/>
                                    {getTagType(ele)}
                        </span>
                            )
                        })}
                    </div>
                }
            </div>
        </div>
    );
};