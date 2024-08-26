import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation, useParams } from 'react-router-dom';
import projectIcon from '../assets/icons/project.svg';
import collaboratorsIcon from '../assets/icons/team.svg';

const ProjectLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, project } = useParams();
  const projectID = `${user}-${project}`;
  const [breadcrumb, setBreadcrumb] = useState(pathname.split('/').filter(ele => ele !== ''));

  const currentButton = (section) => {
    return pathname.split('/').includes(section);
  };

  useEffect(() => {
    setBreadcrumb(pathname.split('/').filter(ele => ele !== ''));
  }, [pathname]);

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-cols-2 py-4">
        <div className="col-start-1 col-span-1 w-1/5 h-screen gap-10 flex flex-col items-start pl-4">
          <div className='w-full'>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                {breadcrumb.map((result, index) => (
                  <li key={index}>
                    <div className="flex items-center">
                      <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                      </svg>
                      <span className="ms-1 text-sm font-medium text-gray-700 md:ms-2">{result}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <button 
            onClick={() => navigate(`/${projectID}/settings/project`)} 
            className={`py-4 flex items-center gap-3 w-full rounded-lg px-3 hover:bg-gray-200 ${currentButton('project') && "bg-gray-300"}`}
          >
            <img src={projectIcon} alt="Project Icon" className="w-6 h-6" />
            Project 
          </button>
          <button 
            onClick={() => navigate(`/${projectID}/settings/collaborators`)} 
            className={`py-4 flex items-center gap-3 w-full rounded-lg px-3 hover:bg-gray-200 ${currentButton('collaborators') && "bg-gray-300"}`}
          >
            <img src={collaboratorsIcon} alt="Collaborators Icon" className="w-6 h-6" />
            Collaborators 
          </button>
        </div>
        <div className="col-start-2 col-span-1 w-4/5 h-screen py-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProjectLayout;
