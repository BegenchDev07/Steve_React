import {forwardRef, useImperativeHandle, useState} from "react";
import "./index.css";

function _genID(node) {

    node.id = node.id ?? node.title;

    for (const child of node.children ?? []) {
        child.id = `${node.id}|${child.title}`;
        _genID(child);
    }
    return node;
}

export const RMBClkContext = forwardRef(({onClick, data}, ref) => {
    const [vis, setVis] = useState(false);
    const [origin, setOrigin] = useState([0, 0]);
    const [menuData] = useState(_genID(data));
    useImperativeHandle(ref, () => {
        return {
            show(pos) {
                setOrigin(pos);
                setVis(true);
            },
            hide() {
                setVis(false);
            }
        }
    }, [vis, origin]);
    const _click = evt => {
        if (onClick) onClick(evt);
    }

    const _genNode = ({id, title, children = []}) => {
        return (
            <menu id={id} title={title}>
                {
                    children.map((child, index) => {
                        return (<>{_genNode(child)}</>)
                    })
                }

            </menu>
        )
    }

    return (<>
        <div ref={ref} onClick={_click}>
            <menu id="ctxMenu"
                  style={{display: `${vis ? 'block' : 'none'}`, left: `${origin[0]}px`, top: `${origin[1]}px`,}}>
                {menuData.children.map(child => _genNode(child))}

                {/*<menu title="File">*/}
                {/*    <menu title="Save"></menu>*/}
                {/*    <menu title="Save As"></menu>*/}
                {/*    <menu title="Open"></menu>*/}
                {/*</menu>*/}
                {/*<menu title="Edit">*/}
                {/*    <menu title="Cut"></menu>*/}
                {/*    <menu title="Copy"></menu>*/}
                {/*    <menu title="Paste"></menu>*/}
                {/*</menu>*/}
            </menu>
        </div>
    </>);
});