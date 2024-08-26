import {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react"
import {$getDocsNodes, $createDocTree, $changeId} from "/src/utils/reader";
import useTilg from 'tilg';
import rightArrowSVG from "../../assets/icons/outline/rightArrow.svg";
import downArrowSVG from "../../assets/icons/outline/downArrow.svg";
import documentSVG from "../../assets/icons/outline/document.svg";
import folderSVG from "../../assets/icons/outline/folder.svg";
import "./pie.css";

const Loading = ({id, loadingMap}) => {
    const [data, setData] = useState(0);
    useEffect(_ => {
    }, [loadingMap])
    //{"--p":`${loadingMap.find(ele=>ele.id===id)?.percentage??0}`, "--c":'orange'}
    return (<>
        <div id={id} className="pie animate no-round"
             style={{"--p": `${loadingMap.find(ele => ele.id === id)?.percentage ?? 0}`, "--c": 'gray'}}>
            {/* <p className="absolute top-2 font-semibold">
                {loadingMap.find(ele=>ele.id===id)?.percentage??0}
            </p> */}
        </div>
    </>)
}

const TreeView = forwardRef((props, ref) => {
    const treeRef = useRef(null);
    const {project, data, onOpen, onDragChange, onSelectChange} = props;
    const [treeData, setTreeData] = useState($createDocTree(data, project));
    const [nodes, setNodes] = useState($getDocsNodes(treeData));
    const [loadingMap, setLoadingMap] = useState([]);

    useTilg();

    useImperativeHandle(ref, () => {
        return {
            setLoadingPercentage(id, percentage) {
                const loadingId = `${id}-loading`;
                setLoadingMap(prev => ([...prev.filter(({id}) => id !== loadingId), {
                    id: loadingId,
                    percentage: parseInt(percentage * 100)
                }]));
            }
        };
    }, [loadingMap]);

    const INIT_FOLDER_STATUS = entries =>
        entries.map((ele) => ({id: ele.id, isFolded: true}));
    const initFolderStatus = (nodes) => {
        debugger;
        const entries = nodes.filter((node) => node.children),
            local = localStorage.getItem(project),
            folder = local ? JSON.parse(local)?.doc?.folder : [];
        return folder.length === entries.length ? folder : INIT_FOLDER_STATUS(entries);
    };

    const [folderStatus, setFolderStatus] = useState([]);

    const checkForRightClick = event => {
        // event.preventDefault();
        const childID = Object.values(event.target.childNodes[0].childNodes).map((result) => {
            if (result.id !== '') {
                return result.id
            }
        }).filter(element => element !== undefined)
        if (document.getElementById(childID[0])?.classList.contains('hidden')) {
            document.getElementById(childID[0])?.classList.replace('hidden', 'visible')
            debugger;
        }
    }

    let dragged, draggingOver, mode;

    const CSS_SELECTION = ['bg-transparent', 'bg-gray-300'],
        CSS_INSERT = ['border-0', 'border-t'];

    const
        dragstart = e => {
            dragged = e.currentTarget;
        };

    const _selectChange = (mode, dom) => {
        if (mode === 'select') {
            dom?.classList.replace(CSS_SELECTION[0], CSS_SELECTION[1]);
        } else
            dom?.classList.replace(CSS_SELECTION[1], CSS_SELECTION[0]);

        if (onSelectChange)
            onSelectChange(mode, nodes.find(ele => ele.id === dom.id));
    }

    const
        dragover = evt => {
            evt.stopPropagation();
            evt.preventDefault();
            if (dragged.id === evt.currentTarget.id) return;

            const curY = evt.nativeEvent.offsetY,
                height = evt.currentTarget.clientHeight,
                droppingNode = document.getElementById(draggingOver.id);
            // console.log(evt.nativeEvent.offsetY, evt.currentTarget.clientHeight);
            if (curY > height * 0.2) {
                mode = 'reparent';

                // droppingNode?.classList.replace(CSS_SELECTION[0],CSS_SELECTION[1]);
                _selectChange('select', droppingNode);
            } else {
                mode = 'insert';
                droppingNode?.classList.replace(CSS_INSERT[0], CSS_INSERT[1]);
            }
        },
        clear = node => {
            node?.classList.replace(CSS_INSERT[1], CSS_INSERT[0]);
            // node?.classList.replace(CSS_SELECTION[1],CSS_SELECTION[0]);

            _selectChange('deselect', node);
        },
        dragleave = e => {
            if (!draggingOver) return;

            const dragOverTarget = document.getElementById(draggingOver.id);
            clear(dragOverTarget);
        },
        dragenter = e => {
            draggingOver = e.currentTarget;
            if (dragged.id === draggingOver.id) return;


        },
        drop = e => {
            const
                draggingNode = nodes.find(({id}) => id === dragged.id),
                dropNode = nodes.find(({id}) => id === e.currentTarget.id),
                delChildIndex = nodes[draggingNode.parentIndex].children.findIndex(({id}) => id === draggingNode.id);

            const draggingSummary = dragged.parentElement.parentElement;
            draggingSummary.open = false;


            clear(e.currentTarget);
            //del
            nodes[draggingNode.parentIndex].children.splice(delChildIndex, 1);
            if (mode === 'reparent') {
                if (!dropNode.children) {
                    debugger;
                    dropNode.children = [];
                }
                ;
                const addChildIndex = 0;//insert first, easy to find
                $changeId(dropNode.id, draggingNode);
                dropNode.children.splice(addChildIndex, 0, draggingNode);
            } else if (mode === 'insert') {

                const addChildIndex = nodes[dropNode.parentIndex].children.findIndex(({id}) => id === dropNode.id);
                $changeId(nodes[dropNode.parentIndex].id, draggingNode);

                //add
                nodes[dropNode.parentIndex].children.splice(addChildIndex, 0, draggingNode);

            }

            const
                root = nodes[0],
                newData = save(root).join('\n'),
                newTree = $createDocTree(newData),
                newNodes = $getDocsNodes(newTree);
            setNodes(newNodes);
            setTreeData(newTree);

            // const newStatus = {...initFolderStatus(nodes), ...folderStatus};
            //setFolderStatus();

            setFolderStatus(prev => ([...initFolderStatus(nodes), ...prev]));

            if (onDragChange)
                onDragChange(newData);
            e.preventDefault();
        }

    const save = root => {
        return $getDocsNodes(root).map(({title, id, path}) => {
            const layers = id.split('|').length;
            let indents = '';
            for (let i = 0; i < layers; i++)
                indents += '    ';
            const pathStr = path ? `{${path}}` : '';
            return `${indents}${title} ${pathStr}`;
        })
    }

    const restoreNodes = () => {
        for (const {id} of nodes) {
            const isSelected = document.getElementById(id)?.classList.contains(CSS_SELECTION[1]);
            if (isSelected)
                _selectChange('deselect', document.getElementById(id));
        }
    }
    const open = evt => {
        const
            target = evt.currentTarget.parentElement,
            id = target.id;
        const node = nodes.find(ele => ele.id === id);
        restoreNodes();
        // evt.currentTarget.parentElement.classList.replace(CSS_SELECTION[0],CSS_SELECTION[1]);

        _selectChange('select', target);
        if (node.path && onOpen)
            onOpen(id, node.path);

    }, folderToggle = e => {
        const id = e.currentTarget.parentElement.id;
        const status = folderStatus.slice();
        status.find(ele => ele.id === id).isFolded = !folderStatus.find(ele => ele.id === id).isFolded;
        setFolderStatus(status);
    };


    const assignSVGArrow = (children = [], isFolded) => {
            if (children.length === 0)
                return;
            return (<img className="w-6 h-6" src={(isFolded ? rightArrowSVG : downArrowSVG)}/>)
        },
        assignSVGIcon = (isDocument) => {
            return (<img className="w-6 h-6" src={(isDocument ? documentSVG : folderSVG)}/>)
        };


    const _genNode = ({title, id, path, children = []}, folderStatus) => {
        const
            isFolded = (folderStatus.find(ele => id === ele.id))?.isFolded ?? true,
            isRenderingChildren = (children.length !== 0 && !isFolded);


        return (
            <>
                <div className="flex bg-transparent border-0 px-1 py-1 rounded-md" id={id} draggable={true}
                     onDragStart={dragstart} onDragEnter={dragenter} onDragLeave={dragleave} onDragOver={dragover}
                     onDrop={drop}>
                    <div onClick={folderToggle}>{assignSVGArrow(children, !isRenderingChildren)}</div>
                    <div className="flex bg-transparent items-center" onClick={open}>
                        {assignSVGIcon(!!path)}
                        <p>
                            {title}
                        </p>
                        {loadingMap.find(ele => ele.id === `${id}-loading`) &&
                            <Loading id={`${id}-loading`} loadingMap={loadingMap}/>}
                    </div>
                </div>
                {

                    isRenderingChildren &&
                    children.map((child, index) => {
                        return (
                            <div className="w-full ml-6 py-1 text-start" key={index}>
                                {
                                    _genNode(child, folderStatus)
                                }
                            </div>
                        )
                    })
                }
            </>
        )
    }


    useEffect(() => {
        const treeData = $createDocTree(data, project);
        setTreeData(treeData);
        const nodes = $getDocsNodes(treeData);
        setNodes(nodes);
        setFolderStatus(initFolderStatus(nodes));

    }, [data]);

    useEffect(() => {
        debugger;
        if (folderStatus.length)
            localStorage.setItem(project, JSON.stringify({doc: {folder: folderStatus}}));
    }, [folderStatus]);

    return (
        <>
            <div ref={treeRef} className="w-auto sticky top-0 pt-1 flex flex-col justify-left h-auto z-0 text-start">
                {(treeData !== undefined) && <>{_genNode(treeData, folderStatus)}</>}
            </div>
        </>
    )
})
// const test = memo(TreeView);
export default TreeView;