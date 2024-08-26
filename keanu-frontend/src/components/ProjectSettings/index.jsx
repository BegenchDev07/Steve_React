import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks.js";
import { apiCatcher } from "../../utils/apiChecker.js";
import { createAlert } from "../../redux/reducers/AlertSlice";
import {
  checkProject,
  getProject,
  updateProject,
  deleteProject,
} from "../../services/API/project/index.ts";
import { FileUpload } from "../FileUpload";

const ProjectSettings = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [available, setAvailable] = useState(true);
  const [fileList, setFileList] = useState([]);
  const { user, project } = useParams();

  const handleNameChange = async (projectName) => {
    setIsInput(true);
    setName(projectName);
    setLoading(true);
    apiCatcher(dispatch, checkProject, projectName).then((data) => {
      if (data) {
        setAvailable(data.availability);
        setLoading(false);
      }
    });
    if (!projectName) setIsInput(false);
  };

  const handleDescriptionChange = (description) => {
    setDescription(description);
  };

  const handleCheckChange = (event) => {
    setIsPrivate(event.target.id === "push-email");
  };

  const handleWebsiteChange = (website) => {
    setWebsite(website);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    apiCatcher(dispatch, updateProject, `${user}-${project}`, {
      name,
      description,
      website,
      isPrivate,
    }).catch((err) => {
      console.log(err);
      dispatch(
        createAlert({
          type: "error",
          message: `update project ${user}-${project} failed, ${err}`,
        })
      );
    });
  };

  const handleDelete = (event) => {
    event.preventDefault();
    apiCatcher(dispatch, deleteProject, `${user}-${project}`)
      .then(() => {
        dispatch(
          createAlert({
            type: "success",
            message: `project ${user}-${project} deleted`,
          })
        );
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          createAlert({
            type: "error",
            message: `delete project ${user}-${project} failed, ${err}`,
          })
        );
      });
  };

  useEffect(() => {
    setLoading(true);
    apiCatcher(dispatch, getProject, `${user}-${project}`)
      .then((project) => {
        if (project) {
          setName(project.project_id.split("/")[1]);
          setDescription(project.project_meta?.description);
          setWebsite(project.project_meta?.homePageURL);
          setIsPrivate(project.is_private);
        }
      })
      .finally(() => setDataLoading(false));
  }, []);

  return (
    <div className="application-main w-full h-full flex flex-row">
      <div className="sm:w-full lg:w-4/5 mx-auto flex flex-row">
        <div className="md:w-3/4 flex-grow">
          {dataLoading ? (
            <div className="w-full flex justify-center">Loading...</div>
          ) : (
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
                        <div className="mt-1 flex items-center justify-center rounded-md shadow-sm">
                          <input
                            onChange={(e) => handleNameChange(e.target.value)}
                            value={name}
                            className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                            type="text"
                            aria-label="Filter projects"
                            required
                            placeholder="project name"
                          />
                          {isInput &&
                            (loading ? (
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
                            ) : available ? (
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
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Project website
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            http(s)://
                          </span>
                          <input
                            className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                            type="text"
                            value={website}
                            onChange={(e) => handleWebsiteChange(e.target.value)}
                            aria-label="Filter projects"
                            placeholder="example.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium text-gray-700"
                      >
                        About the project (markdown support later)
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="about"
                          name="about"
                          rows={8}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                          placeholder="project description"
                          value={description}
                          onChange={(e) => handleDescriptionChange(e.target.value)}
                        ></textarea>
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
                              checked={isPrivate === false}
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
                              checked={isPrivate === true}
                              onChange={handleCheckChange}
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
                      <label className="block text-sm font-medium text-gray-700 py-2">
                        Cover image
                      </label>
                      <FileUpload dropzone={true} uploadPath={"abc/def/"} />

                      <div className="px-4 py-3 text-right sm:px-6">
                        <button
                          onClick={handleDelete}
                          className="inline-flex justify-center py-2 px-4 mr-6 border border-transparent shadow-sm text-sm font-medium rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
                        >
                          Delete
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
