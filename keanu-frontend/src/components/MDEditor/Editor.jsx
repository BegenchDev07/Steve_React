import {useCallback, useEffect, useRef, useState} from "react";
import ExampleTheme from "./ExampleTheme";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";


import ToolbarPlugin from "./plugins/ToolbarPlugin";
import AutoEmbedPlugin from "./plugins/AutoEmbedPlugin";
import TwitterPlugin from "./plugins/TwitterPlugin";
import YouTubePlugin from "./plugins/YouTubePlugin";
import FigmaPlugin from "./plugins/FigmaPlugin";
import KeanuPlugin from "./plugins/KeanuPlugin";

import {HeadingNode, QuoteNode} from "@lexical/rich-text";
import {TableCellNode, TableNode, TableRowNode} from "@lexical/table";
import {ListItemNode, ListNode} from "@lexical/list";
import {CodeHighlightNode, CodeNode} from "@lexical/code";
import {AutoLinkNode, LinkNode} from "@lexical/link";
import {ImageNode} from "./nodes/ImageNode";
import {YouTubeNode} from "./nodes/YouTubeNode";
import {TweetNode} from "./nodes/TweetNode";
import {FigmaNode} from "./nodes/FigmaNode";
import {KeanuNode} from "./nodes/KeanuNode";
import {LinkPlugin} from "@lexical/react/LexicalLinkPlugin";
import {ListPlugin} from "@lexical/react/LexicalListPlugin";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";


import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import {$getRoot} from "lexical";
import {BLUR_COMMAND, COMMAND_PRIORITY_LOW, CLEAR_EDITOR_COMMAND} from 'lexical';
import {useDispatch} from "react-redux";
import {useAppDispatch} from "../../redux/hooks.js";


function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text, markdown supported...</div>;
}


function Save({saveButtonName, saveCallback}) {
    const [editor] = useLexicalComposerContext();
    const saveContent = (content) => {
        editor.update(async () => {

            // save2LexicalFile(saveCallback);
            const editorState = editor.getEditorState();
            saveCallback(editorState);

        });
    };

    return (
        <div>
            {
                <div className="w-full bg-blue-500 rounded h-full">
                    <a
                        className="w-full rounded py-1 no-underline text-center text-white cursor-pointer"
                        type="submit"
                        onClick={
                            saveContent
                        }
                    >
                        {saveButtonName}
                    </a>
                </div>

            }


        </div>
    );
}

function saveLexicalJSON(editor, callback) {
    const editorState = editor.getEditorState();
    callback(editorState);
}

function RefreshPlugin({editorData}) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        if (!editorData) {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, null);
        } else {
            queueMicrotask(() => {
                const newState = editor.parseEditorState(editorData);
                editor.setEditorState(newState);
            });
        }

    }, [editorData]);
    return null;
}

const useDebouncedCallback = (func, wait) => {
    // Use a ref to store the timeout between renders
    // and prevent changes to it from causing re-renders
    const timeout = useRef();

    return useCallback(
        (...args) => {
            const later = () => {
                clearTimeout(timeout.current);
                func(...args);
            };

            clearTimeout(timeout.current);
            timeout.current = setTimeout(later, wait);
        },
        [func, wait]
    );
};

function AutoSavePlugin({saveCallback}) {
    // useEffect(() =>{
    //     editor.registerCommand(BLUR_COMMAND, _=>
    //         editor.update(_=> {
    //
    //             saveLexicalJSON(editor,saveCallback);
    //         }), COMMAND_PRIORITY_LOW);
    //
    // },[]);
    // return null;
    //const dispatch = useAppDispatch();

    const [editor] = useLexicalComposerContext();
    const onChange = useDebouncedCallback((editorState) => {
        editor.update(_=>{
            const editorState = editor.getEditorState();
            saveCallback(editorState);
        })
        //dispatch({})
    }, 1000);

    return <OnChangePlugin onChange={onChange} ignoreSelectionChange={true}/>;

}

export default function Editor({
                                   onSave,
                                   placeholderFlag,
                                   editable = true,
                                   editorState,
                               }) {
    const [editorData, setEditorData] = useState(editorState);
    useEffect(() => {
        setEditorData(editorState)
    }, [editorState]);

    const editorConfig = {
        editable,
        // editorState,
        // The editor theme
        theme: ExampleTheme,
        // Handling of errors during update
        onError(error) {
            throw error;
        },
        // Any custom nodes go here
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode,
            ImageNode,
            YouTubeNode,
            TweetNode,
            FigmaNode,
            KeanuNode
        ],
    };
    // if (clear) {
    //     editor.update(() => {
    //         $getRoot().clear();
    //     })
    // }

    return (
        <LexicalComposer initialConfig={editorConfig}>
            {/* <div className="editor-container"> */}
            <div className="w-auto bg-transparent">
                {editable && <>
                    <ToolbarPlugin/>
                </>}
                <div className="editor-inner bg-transparent">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input bg-transparent"/>}
                        placeholder={(placeholderFlag) ? <Placeholder/> : null}
                        ErrorBoundary={LexicalErrorBoundary}
                    />                    
                    {editable &&
                        <>  <HistoryPlugin/>
                            {/* <TreeViewPlugin /> */}
                            <AutoFocusPlugin/>

                            <AutoEmbedPlugin/>
                            <TwitterPlugin/>
                            <YouTubePlugin/>
                            <FigmaPlugin/>
                            <KeanuPlugin/>

                            <CodeHighlightPlugin/>
                            <ListPlugin/>
                            <LinkPlugin/>
                            <ImagesPlugin/>
                            <AutoLinkPlugin/>
                            <ListMaxIndentLevelPlugin maxDepth={7}/>
                        </>
                    }
                </div>
            </div>
            <RefreshPlugin editorData={editorData}/>
            <>
                {onSave && <AutoSavePlugin saveCallback={onSave}/>}
            </>
        </LexicalComposer>
    );
}
