import { useState } from "react";
import {checkIn} from "../../services/API/cart"

const AddPrice = () => {
  const [resourceLink, setResourceLink ] = useState("")
  const [discription, setDiscription] = useState("")
  const [name, setName ] = useState("")
  const [unitAmount, setUnitAmount ] = useState("")
  
  const onSubmit = ()=>{
    checkIn(name, discription, unitAmount)
  }
  return (
    <div style = {{display:"flex", flexDirection:"column"}}>
                  <label className="text-lg font-semibold ">Name</label>
      <input
        className="border-transparent  py-0.5 px-2"
        name="price"
        id=""
        placeholder=""
        onChange={(e)=>setName(e.target.value)}

      />
            <label className="text-lg font-semibold ">Discription</label>
      <input
        className="border-transparent  py-0.5 px-2"
        name="price"
        id=""
        placeholder=""
        onChange={(e)=>setDiscription(e.target.value)}

      />
      <label className="text-lg font-semibold ">Resource Link</label>
      <input
        className="border-transparent py-0.5 px-2"
        id=""
        placeholder=""
        onChange={(e)=>setResourceLink(e.target.value)}
      />
      <label className="text-lg font-semibold ">Price</label>
      <input
        className="border-transparent  py-0.5 px-2"
        name="price"
        id=""
        placeholder=""
        onChange={(e)=>setUnitAmount(e.target.value)}

      />


    <button onClick={onSubmit} style={{borderColor:"gray", borderWidth:1}}>Submit</button>
    </div>
  );
};
export default AddPrice;
