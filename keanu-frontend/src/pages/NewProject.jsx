import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "/src/redux/hooks";
import { apiCatcher, s3Catcher } from "/src/utils/apiChecker";
import { checkProject, createProject } from "/src/services/API/project";
function NewProject() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const username = user.profile.username;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isInput, setIsInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [available, setAvailable] = useState(true);
    const [fileList, setFileList] = useState([]);

    const handleCheckChange = (event) => { };

    const handleNameChange = async (projectName) => {
        setIsInput(true);
        setName(projectName);
        setLoading(true);

        apiCatcher(dispatch, checkProject, projectName)
            .then((data) => {
                if (data) {
                    setAvailable(!data.value.exist);
                    setLoading(false);
                }
            })
        if (!projectName) setIsInput(false);
    };

    const handleDescriptionChange = (description) => {
        setDescription(description);
    };

    const handleWebsiteChange = (website) => {
        setWebsite(website);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        return apiCatcher(dispatch, createProject, { name, description, website, isPrivate })
            .then(data => {
                if (fileList[0])
                    return s3Catcher(dispatch, 'uploadFile', data.projectId, `${data.projectId}/.setting/cover.png`, fileList[0]);
                else
                    return Promise.resolve();
            })
            .then(_ => navigate(`/${username}-${name}`));
    };

    return (
        <div className="application-main w-full h-full flex flex-row text-3xl font-bold p-3">
            <div className="container sm:w-full lg:w-4/5 mx-auto">
                <div>
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium leading-6">New Project</h3>
                                <p className="mt-1 text-sm text-slate-600 py-2">
                                    This information may be displayed publicly so be careful what
                                    you share.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <form>
                                <div className="shadow sm:rounded-md sm:overflow-hidden">
                                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="col-span-3 sm:col-span-2">
                                                <label
                                                    htmlFor="company-website"
                                                    className="block text-sm font-medium text-gray-700 after:content-['*']  after:text-red-600 after:px-2"
                                                >
                                                    Project name
                                                </label>
                                                <div
                                                    className="mt-1 flex items-center justify-center rounded-md shadow-sm">
                                                    <input
                                                        onChange={(e) => handleNameChange(e.target.value)}
                                                        className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                                                        type="text"
                                                        aria-label="Filter projects"
                                                        required
                                                        placeholder="project name"
                                                    />
                                                    {isInput
                                                        ? [
                                                            loading ? (
                                                                <svg
                                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="4"
                                                                    ></circle>
                                                                    <path
                                                                        className="opacity-75"
                                                                        fill="green"
                                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                    ></path>
                                                                </svg>
                                                            ) : (
                                                                [
                                                                    available ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="20px"
                                                                            height="20px"
                                                                            viewBox="0 0 20 20"
                                                                            fill="green"
                                                                            key="yes"
                                                                        >
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                clipRule="evenodd"
                                                                            />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="20px"
                                                                            height="20px"
                                                                            viewBox="0 0 20 20"
                                                                            fill="red"
                                                                            key="no"
                                                                        >
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                                                clipRule="evenodd"
                                                                            />
                                                                        </svg>
                                                                    ),
                                                                ]
                                                            ),
                                                        ]
                                                        : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <fieldset>
                                                <div className="mt-4 space-y-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-everything"
                                                            name="push-notifications"
                                                            type="radio"
                                                            checked
                                                            onChange={handleCheckChange}
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        />
                                                        <label
                                                            htmlFor="push-everything"
                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                        >
                                                            Public
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="push-email"
                                                            name="push-notifications"
                                                            type="radio"
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        />
                                                        <label
                                                            htmlFor="push-email"
                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                        >
                                                            Private
                                                        </label>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Cover image
                                            </label>
                                            {/* <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg> */}
                                            {/* <Dragger {...props}> */}
                                            <p className="ant-upload-drag-icon">
                                                {/* <InboxOutlined /> */}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                                </svg>

                                            </p>
                                            <p className="ant-upload-text">
                                                Click or drag picture to this area to upload
                                            </p>
                                            <p className="ant-upload-hint">
                                                PNG, JPG, WebP up to 5MB
                                            </p>
                                            {/* </Dragger> */}

                                            <div className="px-4 py-3 text-right sm:px-6">
                                                <button
                                                    onClick={handleSubmit}
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Create
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewProject;
