import { useState } from "react";
import {load, save} from "../../utils/storageOperation.js";
import { useParams } from "react-router-dom";

export default function SellSection() {
  const {uuid} = useParams();  
  const handleSave = (evt, type = 'title') => {save(uuid,type,evt.target.value)}
  const loadValue = key => load(uuid,key);

  return (<div className="bg-white rounded-lg">
    <div className="flex flex-col gap-3">
          <div className="flex flex-col items-start gap-3 p-4 mb-4 text-sm text-red-800 bg-red-300/50 rounded-t-lg shadow-md" role="alert">
            <span className="font-semibold text-2xl">Attention!</span>
            <div className="flex gap-3">
              <input type="checkbox" name="" id="" required />
              <p>
                To take this action you have to agree with our terms and conditions !
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-white rounded-md py-3 px-3">
            <label className="font-semibold text-2xl">
              Price
            </label>
            <input defaultValue={loadValue('price')}
                   className="hover:outline focus:outline px-2 py-0.5"
                   type="number" name="priceFrom" id="" step="0.01"
                   placeholder="0.00" min={1}
                   onChange={evt=>{handleSave(evt,'price')}}
                   required={true}
                   />

            {/* <label className="text-lg font-semibold">
              From
                </label> */}
            <label className="text-lg font-semibold">
              Select Currency
            </label>
            <select  defaultValue={loadValue('currency')}
                className="border outline-none" id="currency" name="currency"
                    onChange={evt=>{handleSave(evt,'currency')}} required>
              <option value="">NONE</option>
              <option value="USD">USD</option>
              <option value="HKD">HKD</option>
            </select>
          </div>
        </div>
    {/* {
      (!showPrice)
        ? <div className="flex flex-col gap-3 bg-white rounded-md py-3 px-3">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-xl text-gray-400">
              Price
            </label>

            <label className="text-lg font-semibold text-gray-300">
              From
            </label>
            <input className="text-gray-300 border-transparent focus:outline-none focus:ring-0 py-0.5 px-2" type="number" name="price" id="" placeholder="0.00$" disabled />
            <label className="text-lg font-semibold text-gray-300">
              To
            </label>
            <input className="text-gray-300 border-transparent focus:outline-none focus:ring-0 py-0.5 px-2" type="number" name="price" id="" placeholder="0.00$" disabled />
          </div>
        </div>
        : <div className="flex flex-col gap-3 py-3">
          <div className="flex flex-col items-start gap-3 p-4 mb-4 text-sm text-red-800 bg-red-50" role="alert">
            <span className="font-semibold text-2xl">Attention!</span>
            <div className="flex gap-3">
              <input type="checkbox" name="" id="" required />
              <p>
                To take this action you have to agree with our terms and conditions !
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-white rounded-md py-3 px-3">
            <label className="font-semibold text-2xl">
              Price
            </label>

            <label className="text-lg font-semibold">
              From
            </label>
            <input className="hover:outline focus:outline px-2 py-0.5" type="number" name="priceFrom" id="" placeholder="0.00$" />
            <label className="text-lg font-semibold">
              To
            </label>
            <input className="hover:outline focus:outline px-2 py-0.5" type="number" name="priceTo" id="" placeholder="0.00$" />
          </div>
        </div>
    } */}
  </div>
  )
}