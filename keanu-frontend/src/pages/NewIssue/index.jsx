import React, {useState, useEffect, useRef, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Tags from "/src/components/Tags";
import MDEditor from "/src/components/MDEditor";
import {newIssue} from "/src/services/API/issues";
import DropzoneUpload from "/src/components/DropzoneUpload";
import {getS3} from "/src/utils/reader";
import {apiCatcher} from "/src/utils/apiChecker";
import {useAppDispatch} from "/src/redux/hooks";
import {genUUID} from "/src/utils/reader";

export default function NewIssue() {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const editorRef = useRef(null);
    const {user, project} = useParams();
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [createEnabled, setCreateEnabled] = useState(false);

    const handleTitleChange = (title) => {
        if (title) {
            setTitle(title);
            setCreateEnabled(true);
        } else {
            setCreateEnabled(false);
        }
    };

    const handleTagsChange = (tags) => {
        console.log(tags);
        setTags(tags);
    };

    // Save issue in database
    // const handleSave = async (body: string) => {
    //   let res = await newIssue(`${user}/${project}`, title, body);
    //   if(res.result === 'success') {
    //     navigate(`/${user}/${project}/issues`);
    //   }
    // }
    // Save issue as markdown on cos

    const handleSave = async (content) => {
        const mdBlob = new Blob([content], {type: "text/markdown"});
        const s3 = getS3();

        const resourceLink = `${user}/${project}/.issues/${genUUID()}/index.md`;//${encodeURIComponent(title)}.md

        s3.uploadFile(
            `${user}-${project}`,
            resourceLink,
            mdBlob
        )
            .then((result) =>
                apiCatcher(
                    dispatch,
                    newIssue,
                    `${user}-${project}`,
                    resourceLink,
                    tags,
                    title
                )
            )
            .then((_) => navigate(`/${user}-${project}/issues`));
    };

    const onSubmit = async (event) => {
        if (title === "") {
            return;
        }

        // const content = editorRef?.current?.getContent();
        // await newIssue(`${user}/${project}`, title, content);
    };

    useEffect(() => {
    }, []);

    return (
        <div className="application-main w-full h-full flex flex-row">
            <main className="w-full">
                <div className="flex px-6 border-b-2 border-gray-300">
                    <h1 className="px-6 py-1 text-base font-bold">New issue</h1>
                </div>
                <Tags
                    projectId={`${user}-${project}`}
                    onTagsChange={handleTagsChange}
                />
                <div>
                    <h2>Title</h2>
                    <input
                        type="text"
                        placeholder="title"
                        onChange={(event) => handleTitleChange(event.target.value)}
                        className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                    />
                </div>
                <MDEditor saveButtonName={'Submit issue'} onSave={handleSave}/>

                <h2>Drop folder to upload</h2>
                <DropzoneUpload projectId={`${user}-${project}`}/>
            </main>
        </div>
    );
}
