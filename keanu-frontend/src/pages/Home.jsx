import Dashboard from '/src/components/Dashboard';
import AvatarImage from '../components/AvatarImage';

export  default function Home () {

  const handleDropDown = (target) => {
    if(document.getElementById(target).classList.contains('hidden'))
      document.getElementById(target).classList.replace('hidden','visible')
    else  
      document.getElementById(target).classList.replace('visible','hidden')
  }

  return (
    <div className="w-full h-full flex flex-row application-main">
      <main className="w-full h-full flex flex-row application-main">
        <div className="w-full h-screen flex flex-col items-center container mx-auto gap-5 my-2">
          <div className='w-full h-auto flex justify-center gap-5'>
                <div className='w-3/4 h-auto flex flex-col'>
                  <p className='font-bold text-8xl px-3 rounded-xl border-4 border-dashed border-black'>Welcome to Codesk GameHub</p>
                </div>    
                <div className='w-1/4 h-full flex items-center justify-center relative'>                  
                  <div className='w-full h-full bg-white rounded-2xl px-5 py-3'>                    
                    <h1 className='font-bold text-3xl'>Find Us:</h1>
                    <div className='flex gap-2 py-2'> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                          className="lucide lucide-twitter">
                          <path
                              d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                      </svg>
                      <p className='font-semibold text-xl italic text-gray-600'>@Codesk</p>
                    </div>
                    <div className='flex gap-2 py-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                          className="lucide lucide-instagram">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                      <p className='font-semibold text-xl italic text-gray-600'>@Codesk</p>
                    </div> 
                    <div className='flex gap-2 py-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 50 50" strokeWidth={4}>
                          <path
                              d="M 18.90625 7 C 18.90625 7 12.539063 7.4375 8.375 10.78125 C 8.355469 10.789063 8.332031 10.800781 8.3125 10.8125 C 7.589844 11.480469 7.046875 12.515625 6.375 14 C 5.703125 15.484375 4.992188 17.394531 4.34375 19.53125 C 3.050781 23.808594 2 29.058594 2 34 C 1.996094 34.175781 2.039063 34.347656 2.125 34.5 C 3.585938 37.066406 6.273438 38.617188 8.78125 39.59375 C 11.289063 40.570313 13.605469 40.960938 14.78125 41 C 15.113281 41.011719 15.429688 40.859375 15.625 40.59375 L 18.0625 37.21875 C 20.027344 37.683594 22.332031 38 25 38 C 27.667969 38 29.972656 37.683594 31.9375 37.21875 L 34.375 40.59375 C 34.570313 40.859375 34.886719 41.011719 35.21875 41 C 36.394531 40.960938 38.710938 40.570313 41.21875 39.59375 C 43.726563 38.617188 46.414063 37.066406 47.875 34.5 C 47.960938 34.347656 48.003906 34.175781 48 34 C 48 29.058594 46.949219 23.808594 45.65625 19.53125 C 45.007813 17.394531 44.296875 15.484375 43.625 14 C 42.953125 12.515625 42.410156 11.480469 41.6875 10.8125 C 41.667969 10.800781 41.644531 10.789063 41.625 10.78125 C 37.460938 7.4375 31.09375 7 31.09375 7 C 31.019531 6.992188 30.949219 6.992188 30.875 7 C 30.527344 7.046875 30.234375 7.273438 30.09375 7.59375 C 30.09375 7.59375 29.753906 8.339844 29.53125 9.40625 C 27.582031 9.09375 25.941406 9 25 9 C 24.058594 9 22.417969 9.09375 20.46875 9.40625 C 20.246094 8.339844 19.90625 7.59375 19.90625 7.59375 C 19.734375 7.203125 19.332031 6.964844 18.90625 7 Z M 18.28125 9.15625 C 18.355469 9.359375 18.40625 9.550781 18.46875 9.78125 C 16.214844 10.304688 13.746094 11.160156 11.4375 12.59375 C 11.074219 12.746094 10.835938 13.097656 10.824219 13.492188 C 10.816406 13.882813 11.039063 14.246094 11.390625 14.417969 C 11.746094 14.585938 12.167969 14.535156 12.46875 14.28125 C 17.101563 11.410156 22.996094 11 25 11 C 27.003906 11 32.898438 11.410156 37.53125 14.28125 C 37.832031 14.535156 38.253906 14.585938 38.609375 14.417969 C 38.960938 14.246094 39.183594 13.882813 39.175781 13.492188 C 39.164063 13.097656 38.925781 12.746094 38.5625 12.59375 C 36.253906 11.160156 33.785156 10.304688 31.53125 9.78125 C 31.59375 9.550781 31.644531 9.359375 31.71875 9.15625 C 32.859375 9.296875 37.292969 9.894531 40.3125 12.28125 C 40.507813 12.460938 41.1875 13.460938 41.8125 14.84375 C 42.4375 16.226563 43.09375 18.027344 43.71875 20.09375 C 44.9375 24.125 45.921875 29.097656 45.96875 33.65625 C 44.832031 35.496094 42.699219 36.863281 40.5 37.71875 C 38.5 38.496094 36.632813 38.84375 35.65625 38.9375 L 33.96875 36.65625 C 34.828125 36.378906 35.601563 36.078125 36.28125 35.78125 C 38.804688 34.671875 40.15625 33.5 40.15625 33.5 C 40.570313 33.128906 40.605469 32.492188 40.234375 32.078125 C 39.863281 31.664063 39.226563 31.628906 38.8125 32 C 38.8125 32 37.765625 32.957031 35.46875 33.96875 C 34.625 34.339844 33.601563 34.707031 32.4375 35.03125 C 32.167969 35 31.898438 35.078125 31.6875 35.25 C 29.824219 35.703125 27.609375 36 25 36 C 22.371094 36 20.152344 35.675781 18.28125 35.21875 C 18.070313 35.078125 17.8125 35.019531 17.5625 35.0625 C 16.394531 34.738281 15.378906 34.339844 14.53125 33.96875 C 12.234375 32.957031 11.1875 32 11.1875 32 C 10.960938 31.789063 10.648438 31.699219 10.34375 31.75 C 9.957031 31.808594 9.636719 32.085938 9.53125 32.464844 C 9.421875 32.839844 9.546875 33.246094 9.84375 33.5 C 9.84375 33.5 11.195313 34.671875 13.71875 35.78125 C 14.398438 36.078125 15.171875 36.378906 16.03125 36.65625 L 14.34375 38.9375 C 13.367188 38.84375 11.5 38.496094 9.5 37.71875 C 7.300781 36.863281 5.167969 35.496094 4.03125 33.65625 C 4.078125 29.097656 5.0625 24.125 6.28125 20.09375 C 6.90625 18.027344 7.5625 16.226563 8.1875 14.84375 C 8.8125 13.460938 9.492188 12.460938 9.6875 12.28125 C 12.707031 9.894531 17.140625 9.296875 18.28125 9.15625 Z M 18.5 21 C 15.949219 21 14 23.316406 14 26 C 14 28.683594 15.949219 31 18.5 31 C 21.050781 31 23 28.683594 23 26 C 23 23.316406 21.050781 21 18.5 21 Z M 31.5 21 C 28.949219 21 27 23.316406 27 26 C 27 28.683594 28.949219 31 31.5 31 C 34.050781 31 36 28.683594 36 26 C 36 23.316406 34.050781 21 31.5 21 Z M 18.5 23 C 19.816406 23 21 24.265625 21 26 C 21 27.734375 19.816406 29 18.5 29 C 17.183594 29 16 27.734375 16 26 C 16 24.265625 17.183594 23 18.5 23 Z M 31.5 23 C 32.816406 23 34 24.265625 34 26 C 34 27.734375 32.816406 29 31.5 29 C 30.183594 29 29 27.734375 29 26 C 29 24.265625 30.183594 23 31.5 23 Z"></path>
                      </svg>
                      <p className='font-semibold text-xl italic text-gray-600'>@Codesk</p>
                    </div>
                  </div>
                </div>
          </div>
          <div className='w-full h-full flex items-center justify-center gap-5'>
            <div className='flex flex-col w-1/3 h-full gap-5'>
                <div className='relative flex flex-col items-center justify-end h-auto rounded-2xl shadow-2xl cursor-pointer hover:shadow-none'>
                    <img className='z-10 relative rounded-2xl w-full h-full object-contain' src="https://images.pexels.com/photos/7120424/pexels-photo-7120424.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                    <div className='w-full h-full absolute z-20 bg-gradient-to-t from-gray-700 to-gray-50/10 rounded-2xl'></div>
                    <h1 className='absolute z-30 text-4xl font-bold py-5 text-white'>Asset Store</h1>
                </div>
                <div className='flex bg-white flex-col items-center justify-start h-auto rounded-2xl border px-5 py-3'>
                  <h1 className='w-full font-bold underline'>
                    FAQ
                  </h1>
                  <div 
                  onClick={(_)=>{handleDropDown('answer_1')}}
                  className='h-14 w-full border-b-2 border-black flex items-center justify-start cursor-pointer'>
                      <h3 className='font-semibold text-xl'>What is GameHub ?</h3>

                  </div>
                  <div id='answer_1' className='hidden h-auto w-full border-b-2 border-black flex items-start justify-start'>
                      <p className='font-medium text-gray-600 italic py-3 '>GameHub is an online game engine that combines powerful development tools with a vibrant community, much like Figma but for game creators. It inspires and empowers indie developers to collaborate, share ideas, and create amazing games directly in their browser.</p>                      
                  </div>
                  <div 
                  onClick={(_)=>{handleDropDown('answer_2')}}
                  className='h-14 w-full border-b-2 border-black flex items-center cursor-pointer'>
                    <h3 className='font-semibold text-xl'>What can I do with it ?</h3>
                  </div>
                  <div id='answer_2' className='hidden h-auto w-full border-b-2 border-black flex items-start justify-start'>
                      <p className='font-medium text-gray-600 italic py-3 '>
                        Accessing GameHub is straightforward—simply visit our website with no downloads or updates required. Your projects are stored online, allowing you to easily share them through links for others to play and test directly from the web. Additionally, GameHub provides open-source Unity plugin tools that you can customize to integrate smoothly into your own game development pipeline.
                      </p>                      
                  </div>
                  <div 
                  onClick={(_)=>{handleDropDown('answer_3')}}
                  className='h-14 w-full border-b-2 border-black flex items-center cursor-pointer'>
                    <h3 className='font-semibold text-xl'>What's the difference from others ?</h3>
                  </div>
                  <div id='answer_3' className='hidden h-auto w-full border-b-2 border-black flex items-start justify-start'>
                      <p className='font-medium text-gray-600 italic py-3 '>
                      GameHub is a cutting-edge game engine with unique features that set it apart from traditional engines like Unity and Unreal.
                      "Easy to create, easy to share, easy to collaborate" has been our guiding principle since we began designing GameHub five years ago. From day one, our goal has been to make GameHub a community-driven product,not just another standalone software from the '90s." We design our game engine specifically for artists, it minimizes the need for extensive programming knowledge, making game development more accessible. Optimized for browsers, GameHub requires less computational power and can be easily adapted for mobile devices.
                      </p>                      
                  </div>
                  <div className='h-14 w-full border-b-2 border-black flex items-center'>
                    <h3 className='font-semibold text-xl'>Brief Didgest</h3>
                  </div>
                  <div className='h-auto w-full border-b-2 border-black flex items-start justify-start'>
                      <p className='font-medium text-gray-600 italic py-3 '>
                        Much like Figma, we bet everything on browser technology five years ago. As a browser-native web app, we’ve been fortunate to be part of the AI era, where most AI APIs are web-based. Today, GameHub stands as the first AI-powered game engine built entirely for the browser.
                      </p>                      
                  </div>
                </div>                
            </div>
            <div className='flex flex-col w-full h-full relative gap-5'>
                <div className='h-2/3 flex w-full gap-5'>
                    <div className='w-2/3 h-full flex flex-col items-center justify-center bg-white rounded-2xl border gap-5'>
                      <h1 className='text-5xl font-bold'>Our Engine</h1>
                      <iframe src="/engine/index.html?project=jimmy-game&palette=unnamed" className='w-3/4 h-3/4 rounded-xl shadox-xl resize-none'></iframe>
                    </div>
                    <div className='w-1/3 flex flex-col h-full gap-5'>
                      <div className='w-full h-1/2 flex flex-col items-center justify-center bg-white rounded-2xl border'>
                        <h1 className='text-9xl font-extrabold text-black px-3'>10K</h1>
                        <h3 className='font-semibold text-2xl text-gray-400 p-3'>Active visits per month</h3>
                      </div>
                      <div className='relative flex flex-col items-center justify-end h-1/2 rounded-2xl shadow-xl cursor-pointer hover:shadow-none'>
                          <img className='z-10 relative rounded-2xl w-full h-full object-scale' src="https://images.pexels.com/photos/2783837/pexels-photo-2783837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                          <div className='w-full h-full absolute z-20 bg-gradient-to-t from-white via-white/75 to-transparent rounded-2xl'></div>
                          <h1 className='absolute z-30 text-4xl font-bold py-5 text-black'>Stickers</h1>
                      </div>
                      {/* <div className='w-full h-1/2 bg-white rounded-2xl shadow-2xl'>
                        
                      </div> */}
                    </div>
                </div>
                <div className='flex gap-5 h-1/3 w-full rounded-2xl'>                    
                    <div className='w-3/5 h-full flex flex-col items-center justify-around rounded-xl bg-white shadow-xl cursor-pointer hover:shadow-none'>
                      <h1 className='relative h-1/7 w-full flex items-center px-4 py-2 font-semibold text-3xl'>Hot Sales</h1>
                      <div className='h-5/6 w-full flex items-center p-3'>
                        <div 
                        // className='relative w-full h-full bg-gray-400 rounded-2xl'>
                        className='relative flex flex-col items-start justify-end h-full w-full rounded-2xl cursor-pointer hover:shadow-none'>
                            <img 
                            className='z-10 relative rounded-2xl w-full h-full object-scale'
                            src="https://images.pexels.com/photos/4123731/pexels-photo-4123731.jpeg"                            
                            alt="" />
                            <div className='w-full h-full absolute z-10 bg-gradient-to-t from-white via-white/75 to-transparent rounded-2xl'></div>
                            <div className='absolute z-10 bottom-5 px-3 text-black'>
                              <h1 className='font-bold'>Annie & Cora's Cat Cafe</h1>
                              <p className='text-gray-500 font-semibold text-sm'>by @Annie</p>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div className='w-2/5 flex flex-col items-center h-full rounded-xl bg-white px-5 py-3'>
                        <h1 className='w-full font-bold text-3xl'>Join to our creative artists:</h1>
                        <div className='w-full justify-center items-center flex flex-wrap p-5 gap-5'>                          
                          <AvatarImage width={16}/>
                          <AvatarImage width={16}/>
                          <AvatarImage width={16}/>
                          <AvatarImage width={16}/>
                          <AvatarImage width={16}/>
                          <AvatarImage width={16}/>
                          <AvatarImage width={16}/>
                          <AvatarImage width={16}/>
                          <AvatarImage width={16}/>
                          <AvatarImage width={16}/>
                          <AvatarImage width={16}/>
                          <AvatarImage width={16}/>
                        </div>
                    </div>
                </div>
            </div>            
          </div>
          {/* <Dashboard /> */}
        </div>
      </main>
    </div>
  );
}