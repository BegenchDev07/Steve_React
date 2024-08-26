import React, {useState, useEffect} from "react";
import MDEditor from "/src/components/MDEditor";

export default function IssueComment ({projectId, issueNumber, handleSucceeded, resource_link}) {
    useEffect(() => {
    }, []);

    return (
        <div className="application-main w-full h-full flex flex-row">
            <main className="w-full flex flex-col items-center">
                <h1 className="w-3/5 text-xl pl-2 py-2">
                </h1>
                <div className="w-full p-1 text-black">
                    <MDEditor saveButtonName={'comment'} onSave={handleSave}/>
                </div>
            </main>
        </div>
    );
};
