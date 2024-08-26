
import Illustrator from './3rdParties/ai.svg';
import Aseprite from './3rdParties/ase.svg';
import Photoshop from './3rdParties/ps.svg';
import CSP from './3rdParties/csp.svg';
import SAI from './3rdParties/sai.svg';
import GameHub from './common/gamehub.svg';
import Location from './location.svg';
import TwitterX from './twitter-x.svg';


const
    __BG_COLOR = {software:'green', genre:'blue', platform:'pink', customize:'gray'};
// border colors for each type of tag
//Genre: blue-600
//Platform: green-600
//Location: yellow-500 
//Custom,personality,skills: #A91D3A

const
    software = {Illustrator,Aseprite,Photoshop,CSP,SAI},
    platform = {gamehub:GameHub,X:TwitterX};

const   __TYPES = {software:1, genre:2, platform:4, customize:8, personality:16, skills:32, location:64, prestige:128  },
        __TYPES_NAME = {1:'software', 2:'genre', 4:'platform', 8:'customize', 16:'personality', 32:'skills', 64:'location'},
        ICON_TYPES = {
            'gamehub':__TYPES.platform,
            'Illustrator':__TYPES.software,
            'Aseprite':__TYPES.software,
            'Photoshop':__TYPES.software,
            'CSP':__TYPES.software,
            'SAI':__TYPES.software,
            'Detective':__TYPES.genre, 
            'Brainstorm':__TYPES.genre,
            '2D':__TYPES.genre,
            'beijing':__TYPES.location,
            'rome':__TYPES.location,
            '3D':__TYPES.genre,
            'Hades':__TYPES.genre,
            'PixelArt':__TYPES.genre,
            'X':__TYPES.platform,

        };



export const getTagTxt = (tagName) => {
    let txt = null;
    switch (ICON_TYPES[tagName]){
        case __TYPES.software:
            txt = 'ready';
            break;
        case __TYPES.platform:
            txt = 'engine';
            break;
        default:
            txt = '#';
            break;
    }
    return txt;

}

export const getTagType = (tagName) => {
    switch (ICON_TYPES[tagName]){
        case __TYPES.genre:
            return (
                <>
                    <span className="flex w-auto rounded-full justify-center border-2 border-blue-600 capitalize">                                      
                        <div className="w-auto flex px-1 text-center justify-center items-center text-black">
                        #{tagName}
                        </div>
                    </span>
                </>
            )                        
        case __TYPES.platform:
            return (
                <>
                    <span className="w-auto flex rounded-full border-2 border-green-600 relative capitalize px-1">
                        <div className="w-auto rounded-full px-1 text-white items-center">
                            {getTagIcon(tagName)}                        
                        </div>                
                        <div className="w-3/4 px-0.5 flex items-center">
                        {tagName}
                        </div>
                    </span>
                </>
            )
        case __TYPES.location:
            return (
                <>
                    {/* <svg className="absolute flex -top-2 -left-1.5 icon cursor-pointer items-center" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2792" width="10" height="10"><path d="M512 455.431L794.843 172.59a8 8 0 0 1 11.313 0l45.255 45.255a8 8 0 0 1 0 11.313L568.57 512 851.41 794.843a8 8 0 0 1 0 11.313l-45.255 45.255a8 8 0 0 1-11.313 0L512 568.57 229.157 851.41a8 8 0 0 1-11.313 0l-45.255-45.255a8 8 0 0 1 0-11.313L455.43 512 172.59 229.157a8 8 0 0 1 0-11.313l45.255-45.255a8 8 0 0 1 11.313 0L512 455.43z" p-id="2793" fill="#515151"></path></svg>                                           */}
                    <span className="w-auto flex rounded-full border-2 border-yellow-500 relative capitalize px-1">
                        <div className="w-auto rounded-full px-1 text-white items-center">
                            {getTagIcon(tagName)}
                        </div>
                        <div className="w-3/4 px-0.5 flex items-center">
                            {tagName}
                        </div>
                    </span>
                </>
            )
        default:
            return (
                <>
                {/* <svg className="absolute -top-2 -left-1.5 icon cursor-pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2792" width="10" height="10"><path d="M512 455.431L794.843 172.59a8 8 0 0 1 11.313 0l45.255 45.255a8 8 0 0 1 0 11.313L568.57 512 851.41 794.843a8 8 0 0 1 0 11.313l-45.255 45.255a8 8 0 0 1-11.313 0L512 568.57 229.157 851.41a8 8 0 0 1-11.313 0l-45.255-45.255a8 8 0 0 1 0-11.313L455.43 512 172.59 229.157a8 8 0 0 1 0-11.313l45.255-45.255a8 8 0 0 1 11.313 0L512 455.43z" p-id="2793" fill="#515151"></path></svg>                                           */}
                <span className="flex rounded-full justify-center border-2 border-[#A91D3A] relative px-1 py-1 capitalize">                    
                    <div className="w-3/4 flex px-0.5 justify-center">
                    #{tagName}
                    </div>
                </span>
                </>
            )            
    }
}

export const getPillIcon = (tagName) => {
    let icon = null, color = __BG_COLOR.customize;
    const typeStr = __TYPES_NAME[ICON_TYPES[tagName]];
    // debugger;
    switch (typeStr){
        // case "platform":
        //     icon = platform[tagName];
        //     color  = __BG_COLOR[typeStr];
        //     break;
        case "software":
            icon = software[tagName];
            color  = __BG_COLOR[typeStr];
            break;
        default:
            color  = __BG_COLOR[typeStr];
            break;

    }        
    return (
        <>
        {
        (icon)
        &&
        <img src={icon} className="w-8 h-8 rounded-full" alt="" />
        }
        </>
    )
}

export function getTagIcon(tagName){
    // debugger;
    let icon = null;
    const typeStr = __TYPES_NAME[ICON_TYPES[tagName]];
    // debugger;
    switch (typeStr){
        case "platform":
            icon = platform[tagName];
            break;
        case "software":
            icon = software[tagName];
            break;

        case "location":
            icon = Location;
            break;
        case "genre":
            icon = software[tagName];
            break;
        default:
            break;

    }
    // debugger;
    return (
        <>
            {
                (icon)
                &&
                <img className='w-8 h-8' src={icon} alt="" />
            }
        </>
    )

}



export default {Illustrator,Aseprite,Photoshop,CSP,SAI,GameHub};