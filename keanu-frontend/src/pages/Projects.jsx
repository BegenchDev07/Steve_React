import React, { useState, useRef, useEffect } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { apiCatcher } from "../utils/apiChecker.js";
import {
  getDefaultCoverURL,
  getProjectCoverURL,
  getUserProjects,
} from "../services/API/project";
import { useAppSelector, useAppDispatch } from "../redux/hooks.js";

export default function Projects() {
  const { params: {user}} = useMatch("/:user/projects");
  const [projects, setProjects] = useState([]);
  const [projectCoverURLs, setProjectCoverURLs] = useState([]);

  const dispatch = useAppDispatch();

  const fetchProjects = () =>
    apiCatcher(dispatch, getUserProjects, user).then(({ projects }) => {
      return getDefaultCoverURL().then((defaultCoverURL) => {
        projects.forEach(
          (project) => (project["project_cover"] = defaultCoverURL)
        );
        setProjects(projects);
        for (const i in projects) {
          const { project_id } = projects[i];
          getProjectCoverURL(project_id, projects).then((projects) => {
            const covers = projects.map(({project_cover}) => project_cover);
            setProjectCoverURLs(covers);
          });
        }
      });
    });

  function handleImgError(evt) {
    evt.target.src =
      "https://keanu-1302931958.cos.ap-beijing.myqcloud.com/keanuStatic/default-cover.png";
  }

  useEffect(() => {
    fetchProjects();
    return () => {
      setProjects([]);
    };
  }, []);

  return (
    <div className="p-3">
      <div className="flex px-6 projects-toolbar border-b-2 border-gray-300">
        <h1 className="px-6 py-1 text-lg font-semibold">My Projects</h1>
      </div>
      <div className="flex flex-row project-creation-toolbar px-10 py-2">
        <div className="w-48 mx-3">
          <Link
            to="/newProject"
            className="no-underline hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3"
          >
            <svg
              className="group-hover:text-blue-500 mb-1 text-slate-400"
              width="20"
              height="20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
            </svg>
            New project
          </Link>
        </div>
        <div className="w-48 mx-3">
          <Link
            to="/import-project"
            className="no-underline hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3"
          >
            <svg
              className="group-hover:text-blue-500 mb-1 text-slate-400"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
            >
              <path
                d="M540.444444 644.437333l152.576-152.576a28.444444 28.444444 0 1 1 40.220445 40.277334l-201.102222 201.102222a28.330667 28.330667 0 0 1-40.277334 0L290.759111 532.138667a28.444444 28.444444 0 0 1 40.220445-40.277334L483.555556 644.437333V199.111111a28.444444 28.444444 0 0 1 56.888888 0v445.326222zM199.111111 796.444444h625.777778a28.444444 28.444444 0 1 1 0 56.888889h-625.777778a28.444444 28.444444 0 1 1 0-56.888889z"
                fill="#5A6677"
              ></path>
            </svg>
            Import project
          </Link>
        </div>
      </div>
      <div className="px-6 flex flex-col">
        <div className="mt-4 py-2 font-semibold">Explore game templates</div>
        <div className="px-6 py-4 rounded-md bg-gray-100">
          <div className="grid gap-4 grid-cols-template-card grid-rows-1 auto-rows-0	overflow-y-hidden lg:text-sm md:text-base sm:text-sm text-black font-normal leading-6">
            <div className="flex flex-col items-center justify-center">
              <img
                className="object-cover"
                src="https://keanu-1302931958.cos.ap-beijing.myqcloud.com/keanuStatic/game-rpg.jpeg"
                alt=""
              />
              <div className="mt-2">RPG</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                className="object-cover"
                src="https://keanu-1302931958.cos.ap-beijing.myqcloud.com/keanuStatic/game-slg.jpeg"
                alt=""
              />
              <div className="mt-2">SLG</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                className="object-cover"
                src="https://keanu-1302931958.cos.ap-beijing.myqcloud.com/keanuStatic/game-rts.jpeg"
                alt=""
              />
              <div className="mt-2">RTS</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                className="object-cover"
                src="https://keanu-1302931958.cos.ap-beijing.myqcloud.com/keanuStatic/game-sandbox.jpeg"
                alt=""
              />
              <div className="mt-2">Sandbox</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                className="object-cover"
                src="https://keanu-1302931958.cos.ap-beijing.myqcloud.com/keanuStatic/game-puzzles.jpeg"
                alt=""
              />
              <div className="mt-2">Puzzles</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                className="object-cover"
                src="https://keanu-1302931958.cos.ap-beijing.myqcloud.com/keanuStatic/game-sim.jpeg"
                alt=""
              />
              <div className="mt-2">Simulate</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                className="object-cover"
                src="https://keanu-1302931958.cos.ap-beijing.myqcloud.com/keanuStatic/game-moba.webp"
                alt=""
              />
              <div className="mt-2">Moba</div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-2">
        <div className="projects-toolbar flex">
          <div className="px-6 py-2 font-semibold">Projects</div>
        </div>
        <div className="flex flex-col justify-center relative overflow-auto px-6 py-4">
          <div className="grid gap-4 grid-cols-resource-card  md:text-normal sm:text-sm text-slate-600 font-normal leading-6">
            {projects?.map((project, index) => {
              return (
                <div
                  className="resource-card-container flex flex-col items-center border-solid border border-gray-200 rounded-md"
                  key={project.project_id}
                >
                  <div className="w-full h-full flex items-center justify-center bg-neutral-100 rounded-md">
                    <Link to={`/${project.project_id}`}>
                      <div className="flex items-center justify-center">
                        <img
                          className="object-cover w-[330px] h-[200px]"
                          src={projectCoverURLs[index]}
                          onError={handleImgError}
                          loading="lazy"
                          alt=""
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="py-2 font-semibold">{project.project_id}</div>
                </div>
              );
            })}

            {/* <div ref={loadMoreRef}>{loading && <div>...</div>}</div> */}
          </div>
        </div>
      </div>
    </div>
  );
}