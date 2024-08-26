import {useState, useEffect, Fragment} from "react";
import {$debounce, genUUID} from "../../utils/reader";
import {useParams} from "react-router-dom";
import {load, save} from "../../utils/storageOperation";
import {FileUpload, FILE_UPLOAD_MODE} from "../FileUpload";
import {handleFilesChange} from "./FileSection";
import {getPillIcon} from "../../assets/icons/tag";
import {useAppSelector} from "../../redux/hooks.js";
import {getFileByUrl} from "../../utils/dexie/operation.js";

//github


const MultipleSection = ({updateState}) => {
    const [currItemCount, setCurrItemCount] = useState(5);
    const [itemsArr, setItemsArr] = useState([]);
    const [dropdownStatus, setDropdownStatus] = useState(false);
    const [downloadTypes, setDownloadTypes] = useState([]);
    const availableChoices = ['Illustrator', 'Photoshop', 'Aseprite', 'CSP', 'SAI'];
    const {uuid} = useParams();
    const currentUserName = useAppSelector((state) => state.auth.user.username);
    const [fileBlobArr, setFileBlobArr] = useState([]);
    const [bundleItems, setBundleItems] = useState([]);
    

    const handleSelectDownloadType = (data, _id) => {
        const nowChoicesSet = new Set([...downloadTypes, data]),
            nowChoices = Array.from(nowChoicesSet);
        itemsArr.find((ele) => {
            if (ele.uuid === _id) {
                //ele.download.fileTypes = [...ele.download.fileTypes,nowChoices].flat();
                ele.download.fileTypes = nowChoices;
            }
        })
        setItemsArr([...itemsArr]);
        save(uuid, 'variations', itemsArr);
    }

    const handleAddVariation = () => {
        setCurrItemCount(prev => prev - 1);
        setItemsArr(prev => [...prev, {
            uuid: genUUID(),
            name: '',
            unit_amount: '',            
            duration: 0,
            currency: 'USD',
            type: '',
            description:'',
            download: {fileTypes: [], files: []}
        }]);

    }

    const handleRemoveVariation = (e, _id) => {
        const result = itemsArr.filter((ele) => ele.uuid !== _id)
        const bundleResult = bundleItems.filter((ele) => ele.uuid !== _id)
        setBundleItems(bundleResult);
        setItemsArr([...result]);
        save(uuid, 'productItems', result)
        setCurrItemCount(currItemCount + 1);
    }

    const handlePriceInput = (e, _id, bundle) => {
        const ref = itemsArr;
        ref.find((ele) => {
            if ((updateState) ? ele.uuid : ele.uuid === _id){                
                if(bundle){
                    if('unit_amount' in ele){
                        delete ele.unit_amount;
                        ele['discount_ratio'] = parseFloat(e.target.value).toFixed(2);
                        
                    } else {
                        // debugger;
                        ele.unit_amount = parseFloat(e.target.value).toFixed(2);
                    }
                } else {
                    ele.unit_amount = parseFloat(e.target.value).toFixed(2);
                }
            }
        })
        // debugger;
        $debounce(() => {
            setItemsArr([...ref])
        }, 3000, genUUID())
    }

    const handleDurationAmountInput = (e,_id) => {
        const ref = itemsArr;
        ref.find((ele) => {
            if (ele.uuid === _id){
                ele.duration = e.target.value;                
                // debugger;
            }
        })
        $debounce(() => {
            setItemsArr([...ref])
        }, 3000, genUUID())
    }

    // const handleCurrencyInput = (e, _id) => {
    //     const ref = itemsArr;
    //     ref.find((ele) => {
    //         if (ele.uuid === _id)
    //             ele.currency = e.target.value;
    //     })
    //     setItemsArr([...ref]);
    // }

    const handleDescription = (e,_id) => {
        const ref = itemsArr;
        ref.find((ele) => {
            if (ele.uuid === _id){
                debugger;
                ele.description = e.target.value;
            }
        })
        // debugger;
        setItemsArr([...ref])
        // $debounce(() => {
        // }, 3000, genUUID())
    }

    const handleNameInput = (e, _id) => {
        const ref = itemsArr;
        ref.find((ele) => {
            if (ele.uuid === _id)
                ele.name = e.target.value;
        })
        $debounce(() => {
            setItemsArr([...ref])
        }, 3000, genUUID())
    }

    const handleTypeInput = (e, _id) => {
        const ref = itemsArr;
        const inputType = e.target.value;        
        ref.find(ele => {            
            if ((updateState) ? ele.uuid : ele.uuid === _id){
                ele.type = inputType
            }
        });
        setItemsArr([...ref]);
        // eu: if user select one tag,then select another tag, the previous tag will not be removed
        // so,it's better to do it just before the user submit the form
        // const selectedTags = load(uuid, 'tags');
        // if(!selectedTags.includes(inputType)){
        //     selectedTags.push(inputType);
        // }
        // save(uuid, 'tags', selectedTags);
        //
        // Steve: Dude, tags are in a completely different file 
    }

    const handleDurationUnitInput = (e, _id) => {
        const ref = itemsArr;
        ref.find((ele) => {
            if (ele.uuid === _id){
                ele.duration_unit = e.target.value;
                ele.duration_days = calculateDays(ele.duration_amount, e.target.value);
            }
        })
        setItemsArr([...ref]);
    }

    const calculateDays = (amount, unit) => {
        let days = 0;
        if (unit === 'year') {
            days = amount * 365;
        } else if (unit === 'month') {
            days = amount * 30;
        } else if (unit === 'week') {
            days = amount * 7;
        }
        return days;
    };

    useEffect(_ => {
        if (itemsArr.length){
            save(uuid, 'productItems', itemsArr);
        }
    }, [itemsArr]);

    const productCoverUploader = (id) => {
        return (<FileUpload mode={FILE_UPLOAD_MODE.single}
                            fileType={'image/*'}
                            onFilesChange={newFiles => handleFilesChange(newFiles, 'cover', `${currentUserName}/.profile`, `${uuid}/${id}`,
                                (files) => {
                                    const fileBlobArr = files.map(({url, file}) => ({id, type: 'cover', url, file}));
                                    setFileBlobArr(prev => [prev.filter(ele => ele.uuid !== id), ...fileBlobArr]);

                                    files = files.map(ele => ({...ele, file: undefined}));//del file
                                    const ref = itemsArr
                                    ref.find((ele) => {
                                        if (ele.uuid === id)
                                            ele.cover = files[0];
                                    })
                                    setItemsArr([...ref]);
                                })}
                            initFiles={fileBlobArr.filter(ele => ele.uuid === id && ele.type === 'cover').map(({file}) => file)}
        />);
    }

    const renderPriceInput = (val) => {
        return(
            <>
                <div className="w-full h-full flex flex-col items-start justify-start px-3">
                    {
                        (val.type === "bundle")
                        ?
                        <h1 className="text-xl font-bold">Discount Ratio:</h1>
                        :
                        <h1 className="text-xl font-bold">Price:</h1>
                    }
                    <input
                        onChange={(e) => {
                            handlePriceInput(e, (updateState) ? val.uuid : val.uuid,(val.type === "bundle") ? true : false)
                        }}
                        className="hover:outline focus:outline px-3 py-0.5 rounded-lg"
                        type="number" id="" step="0.01"
                        placeholder="0.00" min={(val.type === 'bundle' ? 0 : 1)}
                        defaultValue={(val.type === "bundle" ? val.discount_ratio : val.unit_amount)}
                        key={genUUID()}//https://stackoverflow.com/questions/65886119/react-input-defaultvalue-re-rendering
                        required={true}
                    />
                </div>
                
            </>
        )
    }

    const bundleHelper = (e,data) => {
        if(e.currentTarget.checked){  
            const qty = document.getElementById(data+'_qty')?.value ? document.getElementById(data+'_qty')?.value : 1;
            // const item = itemsArr.find((ele) => ele.uuid === data)
            const ref = [...bundleItems,{uuid:data,quantity:parseInt(qty)??1}]            
            debugger;
            save(uuid,'bundle_items',ref);
            setBundleItems(ref);
        } else {
            const ref = bundleItems.filter((ele) => ele.uuid !== data)
            save(uuid,'bundle_items',ref);            
            setBundleItems(ref)
        }

        debugger;
        

    }    

    const checkBundle = (data) => {
        const result = bundleItems.find((ele) => ele.uuid === data)        
        if(result)
            return true;
        else 
            return false;
    }

    const checkQuantity = (data) => {        
        const ref = bundleItems.find((ele) => {
            if((updateState ? ele.uuid : ele.uuid) === data){
                return parseInt(ele.quantity)
            }
        })??null

        if(ref){            
            return ref.quantity;
        }
        else {
            return 1;        
        }
    }

    const handleQtyInput = (e,data) => {
        e.stopPropagation();
        const qty = document.getElementById(data+'_qty')?.value??0
        let ref = [];
        const bundle_ref = bundleItems.find((ele) => ele.uuid === data)
        // debugger;
        if(!isNaN(qty) && qty !== null && qty !== ""){
            if(bundle_ref){
                bundle_ref.quantity = parseInt(qty)
                const index = bundleItems.findIndex(ele => ele.uuid === bundle_ref.uuid)
                bundleItems[index] = bundle_ref
                ref = bundleItems;
                $debounce(() => {
                    save(uuid,'bundle_items',ref);
                    setBundleItems(ref);
                }, 3000, genUUID())
                debugger;

            } else {
                alert('please select the product first')
                e.currentTarget.value = ''                
            }            
        }
    }

    const renderBundleItem = (val) => {
        const refer = itemsArr.filter((ele) => ele.type !== 'bundle');
        if(refer.length != 0){
            return (            
                <div id={`variation_${val.uuid}`} className={`w-full h-full`}>
                    <div className="w-full flex flex-col items-start justify-center border rounded-lg p-3">
                        {
                            (refer.length != 0)
                            &&
                            refer.map((ele,index)=>{
                                return (
                                    <div key={index} className="flex gap-3">                                        
                                        <input defaultChecked={checkBundle(ele.uuid)} type="checkbox"  id={ele.uuid + '_item'} onChange={(e)=>{bundleHelper(e,ele.uuid)}} />
                                        <p>{ele.name}</p>
                                        {
                                            (ele.type === "physical")
                                            &&
                                            <>
                                                <p>x</p>
                                                <input onChange={(e)=>handleQtyInput(e,ele.uuid)} defaultValue={checkQuantity(ele)} className="border rounded-md px-2" type="number" name="qty" id={ele.uuid + '_qty'} required/>
                                            </>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        }
    }

    const renderDigitalItem = (val) => {
        return (
            <div id={`variation_${val.uuid}`} className={`w-full h-full`}>
                <div className="bg-white rounded-md py-3 px-3">
                    <div className="flex items-center gap-3">
                        <label className="font-semibold text-2xl">
                            Resources:
                        </label>
                        <div className="w-auto flex gap-3 items-center justify-center">
                            {
                                (val?.download?.fileTypes ?? []).map((result, index) => {
                                    return (
                                        <span key={index}>
                                        {
                                            getPillIcon(result)
                                        }
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div id="uploadComponent" className="w-auto h-18">
                        <div className="flex flex-col w-auto items-center justify-start gap-3 py-2">
                            <button onClick={() => {
                                (dropdownStatus === false) ? setDropdownStatus(true) : setDropdownStatus(false)
                            }} id="dropdownHoverButton" data-dropdown-toggle="dropdownHover"
                                    className="text-dark bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                                    type="button">
                                <p className="text-white">Pick the type</p>
                                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="white" strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                </svg>
                            </button>
                            {
                                (dropdownStatus)
                                &&
                                <div id="dropdownHover"
                                     className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownHoverButton">
                                        {
                                            availableChoices.map((result, index) => {
                                                return (
                                                    <li key={index} onClick={() => {
                                                        handleSelectDownloadType(result, val.uuid);
                                                        setDropdownStatus(false)
                                                    }}>
                                                        <p className="block px-4 py-2 hover:bg-gray-100 no-underline text-black">{result}</p>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                        <FileUpload mode={FILE_UPLOAD_MODE.multiple}
                                    onFilesChange={newFiles => handleFilesChange(newFiles, 'digitalItem', `${currentUserName}/.profile`, `${uuid}/${val.uuid}`,
                                        (files) => {
                                            const fileBlobArr = files.map(({url, file}) => ({
                                                id: val.uuid,
                                                url,
                                                file
                                            }));
                                            setFileBlobArr(prev => [prev.filter(ele => ele.uuid !== val.uuid), ...fileBlobArr]);

                                            files = files.map(ele => ({...ele, file: undefined}));
                                            const ref = itemsArr
                                            ref.find((ele) => {
                                                if (ele.uuid === val.uuid)
                                                    ele.download.files = files;
                                            })
                                            //debugger;
                                            setItemsArr([...ref]);
                                        }, false)}
                                    initFiles={fileBlobArr.filter(ele => ele.uuid === val.uuid && ele.type === 'digitalItem').map(({file}) => file)}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const renderServiceItem = (val) => {
        return (
            <div id={`variation_${val.uuid}`} className="w-full h-full">
                <div className="bg-white rounded-md p-4 shadow-lg">
                    <div className="flex flex-col items-start justify-start space-y-4">
                        <h1 className="text-2xl font-semibold text-gray-800">Duration:</h1>
                        <div className="flex items-center gap-3">
                            <input
                                onChange={(e) => {
                                    handleDurationAmountInput(e, val.uuid)
                                }}
                                className="border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="number" name="duration_mount" id="" step="1"
                                placeholder="0" min={1}
                                defaultValue={val.duration}
                                key={genUUID()} //https://stackoverflow.com/questions/65886119/react-input-defaultvalue-re-rendering
                                required={true}
                            />
                            <p className="font-semibold text-lg"> - Days</p>
                            {/* <select
                                defaultValue={val.duration_unit}
                                onChange={(ele) => {
                                    handleDurationUnitInput(ele, val.uuid)
                                }}
                                className="border border-gray-300 rounded-md px-3 py-2 ml-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="year">Year</option>
                                <option value="month">Month</option>
                                <option value="week">Week</option>
                            </select> */}
                        </div>

                    </div>
                </div>

            </div>
        )
    }

    const itemBody = (val, index) => {
        // debugger;
        return (
            <div
                className="w-full h-auto flex flex-col items-center justify-start gap-5 border rounded-lg py-3 px-6 bg-white mb-16">
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-xl font-bold">{index + 1}</h1>
                    <span
                        onClick={(e) => handleRemoveVariation(e, val.uuid)}
                        className="p-1 w-auto h-auto flex flex items-center justify-center rounded-lg bg-red-600 text-white">
                            Remove
                        </span>
                </div>
                <div className="w-full h-full flex items-center gap-3 px-3">
                    <h1 className="text-xl font-bold">Type:</h1>
                    <select
                        className="w-auto border border-gray-300 bg-gray-100/50 rounded-lg text-center outline-none px-1"
                         name="type"
                        onChange={(e) => {
                            (updateState)
                            ?
                            handleTypeInput(e, val.uuid)
                            :
                            handleTypeInput(e, val.uuid)
                        }}
                        defaultValue={val.type}
                        required>
                        <option value="">NONE</option>
                        <option value="digital">Digital</option>
                        <option value="physical">Physical</option>
                        <option value="service">Service</option>
                        <option value="donation">Donation</option>
                        <option value="bundle">Bundle</option>
                    </select>
                </div>
                <div className="w-full flex flex-col items-start justify-start gap-3 px-3">
                    <h1 className="text-xl font-bold">Name:</h1>
                    <input type="text"
                           name="title"
                           onChange={(e) => {
                               handleNameInput(e, val.uuid)
                           }}
                           defaultValue={val.name}
                           key={genUUID()}//https://stackoverflow.com/questions/65886119/react-input-defaultvalue-re-rendering
                           className="w-full rounded-lg hover:outline focus:outline px-2 py-0.5" placeholder="Enter the name"
                           required/>
                </div>                
                <div className="w-full flex flex-col items-start justify-start gap-3 px-3">
                    <h1 className="text-xl font-bold">Cover:</h1>
                    {productCoverUploader(val.uuid)}
                </div>
                <div className="w-full flex flex-col items-start justify-start gap-3 px-3">
                    <h1 className="text-xl font-bold">Description:</h1>
                    <textarea
                     onChange={(e)=>{handleDescription(e,val.uuid)}} 
                     defaultValue={val.description}
                     placeholder="please input your description" 
                     className="w-full px-3 py-1 border rounded-lg" 
                     rows="5" required></textarea>
                </div>
                {
                    (val.type !== "donation")
                    &&
                    renderPriceInput(val)
                }
                {/* <div className="w-full h-full flex items-center gap-3 px-3">
                    <h1 className="text-xl font-bold">Type:</h1>
                    <select
                        className="w-auto border border-gray-300 bg-gray-100/50 rounded-lg text-center outline-none px-1"
                         name="type"
                        onChange={(e) => {
                            (updateState)
                            ?
                            handleTypeInput(e, val.uuid)
                            :
                            handleTypeInput(e, val.uuid)
                        }}
                        defaultValue={val.type}
                        required>
                        <option value="">NONE</option>
                        <option value="digital">Digital</option>
                        <option value="physical">Physical</option>
                        <option value="service">Service</option>
                        <option value="donation">Donation</option>
                        <option value="bundle">Bundle</option>
                    </select>
                </div> */}
                {
                    (val.type === 'digital')
                    &&
                    renderDigitalItem(val)
                }
                {
                    (val.type === 'service')
                    &&
                    renderServiceItem(val)
                }
                {
                    (val.type === 'bundle')
                    &&                                           
                    renderBundleItem(val)
                    
                }
                
            </div>
        )
    }

    const init = () => {
        const items = load(uuid, 'productItems');
        const bundleItems = load(uuid, 'bundle_items');                
        if(bundleItems && bundleItems.length){
            // debugger;
            setBundleItems(bundleItems)
        }
        if (items && items.length) {
            setItemsArr(items);
            setCurrItemCount(5 - items.length);
            const downloadItems = items.filter(ele => ele.type === 'digital');
            // get file from indexedDB
            const downloadDigitalJobs = [
                ...downloadItems.map(ele => ele.download.files.map(({url}) => getFileByUrl(url).then(file => Promise.resolve({
                    url,
                    file
                })))).flat(),
            ];
            return Promise.all(downloadDigitalJobs)
                .then((files) => {
                    const itemArr = [];
                    for (const {url, file} of files) {
                        const {uuid} = downloadItems.find(item => item.download.files.find(ele => ele.url === url));
                        itemArr.push({uuid, file, type: 'digitalItem', url})
                    }
                    setFileBlobArr(itemArr);
                }).then(_ => {
                    const coverJobs = [...items.filter(({cover})=>!!cover).map(({cover}) =>getFileByUrl(cover.url)
                        .then(file=>Promise.resolve({url:cover.url,file})))];
                    return Promise.all(coverJobs)
                        .then((files) => {
                            const itemArr = [];
                            for (const {url, file} of files) {
                                const {uuid} = items.find(item => item.cover.url === url);
                                itemArr.push({uuid, file, type: 'cover', url})
                            }
                            setFileBlobArr(prev => ([
                                ...(prev.filter(ele => !itemArr.find(item => item.uuid === ele.uuid && item.type === ele.type)))
                                , ...itemArr]));
                        })
                });
        } 
    }

    useEffect(() => {
        init()
    }, [])

    // eu: what is this for?
    // Steve: To keep the remaining count of items
    useEffect(() => {
    }, [currItemCount])

    return (
        <>            
            <div className="w-full flex flex-col gap-3 overflow-x-hidden">
                {
                    (itemsArr)
                    &&
                    itemsArr.map((val, index) => {
                        return (
                            <Fragment key={index}>
                                {itemBody(val, index)}
                            </Fragment>
                        )
                    })
                }
                {
                    (currItemCount !== 0)
                    &&
                    <div
                        onClick={handleAddVariation}
                        className="w-72 h-72 flex flex-col border-green-600 items-center justify-center border border-gray-400 rounded-lg">
                        Add +{currItemCount}
                    </div>
                }
            </div>
        </>
    )
}

export default MultipleSection;