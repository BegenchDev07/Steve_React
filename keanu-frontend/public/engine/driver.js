import {driver} from '/engine/src/out.js';

window.addEventListener('engineLoaded',(e)=>{
    // alert('hey')
    setTimeout(()=>{
        const steppies = [
            {
                element:'#root',            
                popover:{
                    title: 'Welcome to our engine !',        
                    description: `Use  📷 to move across / Use 🔍 to zoom`,        
                }
            },
            {
                element:'#Palette_camTumble',
                popover:{
                    title: 'Scroll',        
                    description: 'Use this to scroll across the map',        
                }
            },
            {
                element:'#Palette_camZoom',
                popover:{
                    title: 'Zoom',        
                    description: 'Use this to zoom inside the map',        
                }
            },
            {
                element:'#Palette_select',
                popover:{
                    title: 'Select',        
                    description: 'Use this to select an element',        
                }
            },
            {
                element:'#Palette_paint',
                popover:{
                    title: 'Paint',        
                    description: 'Use this to paint the map',        
                }
            },
            {
                element:'#menu',            
                popover:{
                    title: 'Welcome to our engine !',        
                    description: `Use  📷 to move across / Use 🔍 to zoom`,        
                }
            }
        ]
        // const driver = window.driver.js.driver;        
        const driverObj = driver({
            steps:steppies
        });
        driverObj.drive();
    },1800)
})
