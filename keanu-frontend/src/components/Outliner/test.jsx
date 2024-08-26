import { useEffect, useState, useRef} from "react";
import MDEditor from "/src/components/MDEditor";
import { useAppDispatch } from "/src/redux/hooks";
import { useNavigate,useLocation } from "react-router-dom";
import {$createDocTree, $fetchDocument} from "/src/utils/reader";
import TreeView from "../TreeView";
import {RMBClkContext} from "../RMBClkContext";

const OutlinerTest = ({project='test-Test', folder='.doc'}) => {
    const treeRef = useRef(null);
    const contextMenuRef = useRef(null);
    const dispatch = useAppDispatch();
    const navigator = useNavigate();
    const location = useLocation();
    const [content, setContent] = useState('');
    const [indexData, setIndexData] = useState('');    
    // const dict ={uuid:lexicalJSON};
    const prefix = `${project.split('-').join('/')}/${folder}`;
    const fetchOutlineIndex = ( indexPath = 'outline.index') => {
        return $fetchDocument(dispatch, project, `${prefix}/${indexPath}`)
    };

    let selectedNode = [];
    const _open =
            (id,path)=>{
                setContent(null);//lexical clear
                return $fetchDocument(dispatch, project, `${prefix}/${path}`,
                    percentage=>
                                queueMicrotask(_=> treeRef.current.setLoadingPercentage(id,percentage)))
                    .then((rawData)=> {

                        setContent(rawData); //lexial load
                                            //do "jijia *" corresponding node
                    });
            },

        _dragchange =(rawIndexData)=>{//outline.index
            debugger;
        },
        _selectchange = (mode,node)=>{
            if(mode === 'select')
                selectedNode.push(node.id);
            else
                selectedNode = selectedNode.filter(ele=>ele!==node.id);
    };


    const _save = lexicalData=>{
        debugger;
    };



    const _rmb_menu = evt=>{
        evt.preventDefault();
        const pos =  [(evt.clientX - 10),(evt.clientY)];

        contextMenuRef.current.show(pos);
    },
        _menu_cmd=evt=>{
            const nodeId = selectedNode[0],
               cmd = evt.target.id.split('|').join('-');
            console.log(nodeId, cmd);
            switch (cmd){
                case 'menu-create-folder':
                    break;

                case 'menu-create-doc':
                    break;

                case 'menu-rename':
                    break;


                case 'menu-delete':
                    break;

                default:
                    break;
            }
        }
    
    useEffect(()=>{
        fetchOutlineIndex().then((data)=>setIndexData(data));
    },[indexData]);

    const contextMenuData={title:'menu', children:[

            {title:'create', children:[
                    {title:'folder'},
                    {title:'doc'},
                ]},

            {title:'rename'},
            {title:'delete'},
        ]};


    return (
        <>
        <div className="w-full h-full flex px-4 py-2">


            <RMBClkContext onClick={_menu_cmd} ref={contextMenuRef} data={contextMenuData}/>
            <div className="w-1/5" onContextMenu={_rmb_menu}>
                <TreeView ref={treeRef} project={'test-Test'} data={indexData} onOpen={_open}
                          onDragChange={_dragchange} onSelectChange={_selectchange}/>
            </div>
            <div className="w-4/5">
                <MDEditor editorState={content} clear={false}  editable = {true} onSave={_save}/>
            </div>
            
           {/* <FloatingMenu/> */}
        </div>
        </>
    )
}

export default OutlinerTest;