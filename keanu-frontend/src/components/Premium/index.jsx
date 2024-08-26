import { useEffect, useState } from "react";


const Premium = () => {

    const [tariff,setTariff] = useState({
        'amateur':{
            'monthly': 37.91,
            'annually': 28.88
        },
        'virtuoso':{
            'monthly': 100,
            'annually': 66.66
        }
    })
    const [currentMode, setCurrentMode] = useState(false);

    
    useEffect(()=>{
        console.log(currentMode);
    },[currentMode])

    return (
        <div className="w-full h-full flex flex-col">
            <section className="bg-white">
  <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 ">Designed for our premium members</h2>
            <p className="mb-5 font-light text-gray-500 sm:text-xl ">Here at CoDesk, we focus on markets where technology, innovation, and creativity meets the gaming world.</p>
            
            <div className="flex w-full items-center justify-center">
                <div className="w-auto flex gap-1 border-2 rounded-full">
                    <button 
                    onClick={()=>{setCurrentMode(!currentMode)}}
                    className="rounded-full px-2 py-2">
                        <p className={`relative z-10 ${(!currentMode) && "text-white"}`}>
                            Monthly
                        </p>
                    </button>
                    <button
                    className={`absolute bg-blue-600 w-20 h-10 rounded-full transition-all ease-in-out duration-300 z-0 ${(currentMode) ? "translate-x-20" : "translate-x-0"}`}
                    >
                        
                    </button>
                    <button
                    onClick={()=>{setCurrentMode(!currentMode)}}
                    className="rounded-full px-2 py-2 ">                        
                        <p className={`relative z-10 ${(currentMode) && "text-white"}`}>
                            Annually
                        </p>
                    </button>
                </div>
            </div>
            {/* <label className="inline-flex items-center cursor-pointer px-3 py-2 bg-blue-500 rounded-full">
            <span className="me-3 text-sm font-medium text-gray-900 text-white">Monthly</span>
            <input type="checkbox" value="" className="sr-only peer" onChange={(e)=>{setCurrentMode(!currentMode)}}/>
            <div className="relative w-11 h-6 bg-blue-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-400  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-700"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 text-white">Annual</span>
            </label> */}
      </div>
      <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          
          <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow ">
              <h3 className="mb-4 text-2xl font-semibold">Free pack</h3>
              <p className="font-light text-gray-500 sm:text-lg ">Best option for personal use & for your next project.</p>
              <div className="w-full flex flex-col items-center justify-center my-8">
                    <span className="mr-2 text-5xl font-extrabold">Free</span>                          
              </div>
                 
              
              <ul role="list" className="mb-8 space-y-4 text-left">
                    <li className="flex items-center space-x-3">
                      
                      <svg className="flex-shrink-0 w-5 h-5 text-green-500 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      <span>Verified Account</span>
                  </li>
                  <li className="flex items-center space-x-3">
                      
                      <svg className="flex-shrink-0 w-5 h-5 text-green-500 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      <span>Sell Products</span>
                  </li>
                  <li className="flex items-center space-x-3">
                      
                      <svg className="flex-shrink-0 w-5 h-5 text-green-500 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      <span>Basic Community Features</span>
                  </li>
                  <li className="flex items-center space-x-3">
                      
                      <svg className="flex-shrink-0 w-5 h-5 text-green-500 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      <span>GameHub Engine</span>
                  </li>
                  <li className="flex items-center space-x-3">
                      
                      <svg className="flex-shrink-0 w-5 h-5 text-green-500 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      <span>Public Project</span>
                  </li> 
                                   
              </ul>
              <a href="#" className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Get started</a>
          </div>          
          <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow ">
              <h3 className="mb-4 text-2xl font-semibold">Amateur</h3>
              <p className="font-light text-gray-500 sm:text-lg ">Relevant for multiple users, extended & premium support.</p>
              <div className="w-full flex flex-col justify-center items-center my-8 gap-3">
                <div className="flex items-end">
                  <span className="mr-2 text-5xl font-extrabold">${(currentMode) ? tariff.amateur.annually : tariff.amateur.monthly}</span>
                  <span className="text-gray-500 ">/monthly</span>
                </div>
                  <button className="text-lg font-bold py-2 px-2 rounded-full bg-gradient-to-r from-blue-600 via-teal-400 to-green-300 text-white">
                        Coming soon...
                  </button>     
              </div>
              
              <ul role="list" className="mb-8 space-y-4 text-left">
                  <li className="flex items-center space-x-3">                                            
                      <span className="font-semibold">Everything in Free pack and...</span>
                  </li>
                  
                  <li className="flex items-center space-x-3">
                      
                      <svg className="flex-shrink-0 w-5 h-5 text-green-500 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      <span>Up to 5 private projects</span>
                  </li>
                  <li className="flex items-center space-x-3">
                      
                      <svg className="flex-shrink-0 w-5 h-5 text-green-500 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      <span>Up to 10 Collaborators</span>
                  </li>
              </ul>
              <a href="#" className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Get started</a>
          </div>
          
          <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow ">
              <h3 className="mb-4 text-2xl font-semibold">Virtuoso</h3>
              <p className="font-light text-gray-500 sm:text-lg ">Best for large scale uses and extended features.</p>
              <div className="w-full flex flex-col justify-center items-center gap-3 my-8">
                <div className="flex items-end">
                    <span className="mr-2 text-5xl font-extrabold">${(currentMode) ? tariff.virtuoso.annually : tariff.virtuoso.monthly}</span>
                    <span className="text-gray-500 ">/monthly</span>
                </div>
                <button className="text-lg font-bold py-2 px-2 rounded-full bg-gradient-to-r from-blue-600 via-teal-400 to-green-300 text-white">
                        Coming Soon...
                </button>     
              </div>
              
              <ul role="list" className="mb-8 space-y-4 text-left">
                  <li className="flex items-center space-x-3">
                      
                      {/* <svg className="flex-shrink-0 w-5 h-5 text-green-500 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> */}
                      <span className="font-semibold">Everything in Amateur pack and...</span>
                  </li>
                  <li className="flex items-center space-x-3">
                      
                      <svg className="flex-shrink-0 w-5 h-5 text-green-500 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      <span>Up to 25 private projects</span>
                  </li>
                  <li className="flex items-center space-x-3">
                      
                      <svg className="flex-shrink-0 w-5 h-5 text-green-500 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      <span>Up to 50 Collaborators</span>
                  </li>                  
              </ul>
              <a href="#" className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Get started</a>
          </div>
      </div>
  </div>
</section>
        </div>
    )
}

export default Premium;