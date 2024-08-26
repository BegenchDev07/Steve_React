import layer1 from '../../assets/icons/common/gamehub-1.svg'
import layer2 from '../../assets/icons/common/gamehub-2.svg'
import layer3 from '../../assets/icons/common/gamehub-3.svg'
import GodotSVG from '../../assets/icons/common/godot-engine-svgrepo-com.svg'
import RPGMakerSVG from '../../assets/icons/common/rpg-game-svgrepo-com.svg'
import UnitySVG from '../../assets/icons/common/unity-svgrepo-com.svg'
import UnrealSVG from '../../assets/icons/common/unreal-engine-svgrepo-com.svg'
import CocosXSVG from '../../assets/icons/common/cocos-svgrepo-com.svg'
import ConstructSVG from '../../assets/icons/common/construct3-svgrepo-com.svg'
import ChevronSVG from '../../assets/icons/chevron-down.svg';
import GameHubSVG from '../../assets/icons/common/gamehub.svg';
import Girl1 from '../../assets/png/annie.png'
import Girl2 from '../../assets/png/cora.png'
import BigCat from '../../assets/png/bigcat.png'
import Cat1 from '../../assets/png/cat-1.png'
import Cat2 from '../../assets/png/cat-2.png'
import Cat3 from '../../assets/png/cat-3.png'
import Cat4 from '../../assets/png/cat-4.png'
import Cat5 from '../../assets/png/cat-5.png'
import { Link } from 'react-router-dom'


import './index.css'


const test = () => {
    return (
        <div className='w-full h-full overflow-x-hidden'>
            <div className='intro flex flex-col items-center justify-center gap-5'>
                <h1 className=' font-bold text-9xl'>Scroll Down</h1>                
                <img className='chevron-icon w-32 h-32' src={ChevronSVG} alt="" />                
            </div>
            <div className='stage1 flex items-start justify-center'>
                <div
                className='flex gap-3 items-start justify-center sticky'
                id='text'
                >
                    <div className='flex flex-col items-start justify-center transform'>

                        <div className='liner'>
                            <div className='flex justify-start gap-5'>
                                <span className='font-bold tiredOf' >Sick</span>
                                <span className='font-bold tiredOf' >of using </span>
                            </div>
                            <br />
                            <div className='flex gap-5'>        
                                <div className='flex gap-3 items-center justify-center'>
                                    <span className='text-9xl font-bold letterO' >O</span>
                                    <span className='text-9xl font-bold letterL' >L</span>
                                    <span className='text-9xl font-bold letterD' >D</span>
                                </div>                
                                <div className='h-[20rem] w-[30rem]  rounded-xl grid grid-cols-3 justify-items-center content-center gap-5 px-14 py-7'>
                                    <div className='rotateGodot'>
                                        <img src={GodotSVG} alt="" />
                                    </div> 
                                    <div className='rotateRPGMaker'>
                                        <img src={RPGMakerSVG} alt="" />
                                    </div> 
                                    <div className='rotateUnreal'>
                                        <img src={UnrealSVG} alt="" />
                                    </div>
                                    <div className='rotateUnity'>
                                        <img src={UnitySVG} alt="" />
                                    </div> 
                                    <div className='rotateCocosX'>
                                        <img src={CocosXSVG} alt="" />
                                    </div> 
                                    <div className='rotateConstruct'>
                                        <img src={ConstructSVG} alt="" />
                                    </div> 

                                </div>            
                            </div>
                            
                        </div>                        
                        <div className='flex gap-3'>
                            <span className='text-7xl font-bold brokenGame'>Game</span>
                            <span className='text-7xl font-bold brokenEngine' >Engines</span>
                        </div>
                    </div>
                    <div className='flex gap-3 items-center justify-center'>
                        <span className='text-9xl font-bold question' >?</span>
                    </div>
                </div>                
            </div>
            <div
            className='stage2'
            >
                <div id='stickyScene' className='sticky'>
                    <div id='scene1' className='flex items-center justify-center'>            
                        <img  id='scene1object1' className='w-1/2 absolute' src={layer1} alt="" />
                        <img  id='scene1object2' className='w-1/2 absolute' src={layer3} alt="" />
                        <img  id='scene1object3' className='w-1/2 relative' src={layer2} alt="" />
                    </div>  
                    <h1 id='scene2' className='w-full text-center relative mx-auto py-10 text-7xl font-bold'>GameHub</h1>
                    
                </div>
            </div>
            <div className='stage3 flex flex-col items-center justify-start'>
                <div className='sticky top-10' id='stickyScene'>
                    <div className='w-full h-full flex items-center justify-center'>
                        <div className='w-1/4 h-full flex flex-col items-center justify-between gap-5'>                                                    
                        <div className=' gap-5' id='hero-text-2'>
                            <div className='speech-bubble round b'>
                                <div 
                                // id='hero-text-2'
                                className='relative w-auto h-auto px-5 py-2 bg-blue-500 rounded-xl'>
                                    <h1 className='text-white'>Figma-like collaborative !</h1>
                                </div>
                            </div>
                            <div 
                            // id='hero-text-4'
                            className='relative  w-auto h-auto px-5 py-2 rounded-xl'>                                
                                <img src={Girl2} alt="" />
                            </div>                          
                        </div>
                        <div className='flex items-center' id='hero-text-6'>
                            <div 
                            // id='hero-text-6'
                            className='relative w-auto h-auto px-5 py-2 rounded-xl'>                                
                                <img src={Cat4} alt="" />
                            </div>  
                            <div className='speech-bubble round l'>
                                <div 
                                // id='hero-text-8'
                                className='relative w-auto h-auto px-5 py-2 bg-indigo-500 rounded-xl'>
                                    <h1 className='text-white'>Free & Traded assets in Bazaar</h1>
                                </div>
                            </div>                            
                        </div>
                        <div className='left-10 flex flex-col' id='hero-text-10'>
                            <div className='left-10 speech-bubble-right round b'>
                                <div 
                                // id='hero-text-8'
                                className='relative w-auto h-auto px-5 py-2 bg-colorful-yellow rounded-xl'>
                                    <h1 className='text-white'>Easy project management in cloud</h1>
                                </div>
                            </div>
                            <div className='flex gap-3 justify-between'>
                                <div 
                                // id='hero-text-10'
                                className='relative w-auto h-auto px-5 py-2 rounded-xl'>                                
                                    <img src={Cat2} alt="" />
                                </div>                                              
                                <div 
                                // id='hero-text-12'
                                className='relative w-auto h-auto px-5 py-2 rounded-xl'>                                
                                    <img src={BigCat} alt="" />
                                </div>                                            
                            </div>
                        </div>
                        </div>
                        <div className='hero-intro w-1/2 h-full flex flex-col items-center justify-center gap-10'>                                            
                            <div className='flex flex-col items-center justify-center'>                                
                                <img className='w-52 h-52' src={GameHubSVG} alt="" />
                                <h1 className='text-6xl font-bold text-center'>GameHub</h1>
                            </div>
                            <div>
                                <h1 className='text-8xl font-bold text-center'>Next-gen creation platform</h1>                        
                            </div>                                
                        </div>
                        <div className='w-1/4 gap-5 h-full flex flex-col items-center justify-between pr-3'>
                            <div id='hero-text-1'>
                                <div className='speech-bubble round'>
                                    <div 
                                    // id='hero-text-3'
                                    className='relative  w-auto h-auto px-5 py-2  bg-cyan-600 rounded-xl'>
                                        <h1 className='text-white'>Device-independent</h1>
                                    </div>
                                </div>
                                    <div 
                                    // id='hero-text-1'
                                    className='relative   w-auto h-auto px-5 py-2  rounded-xl'>
                                        <img src={Cat1} alt="" />
                                    </div>
                            </div>
                            <div id='hero-text-5'>
                                <div className='speech-bubble round b'>
                                    <div
                                    className='relative  w-auto h-auto px-5 py-2  bg-indie-red rounded-xl'>
                                        <h1 className='text-white'>Connect with more indie devs</h1>                        
                                    </div>    
                                </div>
                                <div className='flex gap-5'>
                                    <div 
                                    // id='hero-text-5'
                                    className='relative -rotate-12 w-auto h-auto px-5 py-2 rounded-xl'>                                
                                        <img src={Cat5} alt="" />
                                    </div>  
                                    <div 
                                    // id='hero-text-7'
                                    className='relative right-5 -rotate-12 w-auto h-auto px-5 py-2  rounded-xl'>
                                        <img src={Girl1} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div id='hero-text-9' className='flex flex-col items-start justify-center'>                                
                                <div className='flex gap-3'>
                                    <div 
                                    // id='hero-text-11'
                                    className='relative w-auto h-auto px-5 py-2  rounded-xl'>
                                        <img src={Cat3} alt="" />
                                    </div>                                    
                                </div>                               
                                <div className='speech-bubble round t px-4'>
                                    <div
                                    className='relative  w-auto h-auto px-5 py-2  bg-night-blue rounded-xl'>
                                        <h1 className='text-white'>Connect with more indie devs</h1>                        
                                    </div>    
                                </div> 
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
            <div className='stage-4 flex flex-col items-center justify-center w-full h-full gap-5'>
                <Link 
                to='/login'        
                className='w-auto h-auto py-4 px-6 font-semibold text-white text-xl bg-blue-500 rounded-lg'>Try it Now !</Link>
                <iframe src="/engine/index.html?project=jimmy-game&palette=unnamed" className='w-3/4 h-3/4 resize rounded-xl shadox-xl'></iframe>
            </div>
        </div>
    )
}

export default test;