import "./styles.css";
import Editor from "./Editor";

const DEFAULT_LEXICAL_STATE = {"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}};
export default function MDEditor({project,uploadPath, onSave, clear=true, editable = true, editorState}) {


    if(!editorState)
        editorState = DEFAULT_LEXICAL_STATE;
    return (
    <div className="w-full focus:outline ">
      <Editor editorState={editorState} project={project} onSave={onSave} editable = {editable}/>
    </div>
  );
}