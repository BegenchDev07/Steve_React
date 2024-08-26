import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

// import issues api from services
import {  listIssues } from "../../services/API/issues";
import { apiCatcher } from "../../utils/apiChecker";

import { $match, $mdlink2title } from "../../utils/reader";
import { useAppSelector, useAppDispatch } from "../../redux/hooks.js";

// const itemRender: PaginationProps["itemRender"] = (
//   _,
//   type,
//   originalElement
// ) => {
//   if (type === "prev") {
//     return <a>Previous</a>;
//   }
//   if (type === "next") {
//     return <a>Next</a>;
//   }
//   return originalElement;
// };

const Issues = () => {
  const dispatch = useAppDispatch();
  const [issues, setIssues] = useState([]);
  const { user, project } = useParams();
  const { pathname } = useLocation();

  const fetchIssues = () =>
    apiCatcher(dispatch, listIssues, `${user}-${project}`).then(
      ({ issues }) => {
        issues.forEach((issue) => {
          issue.title = $mdlink2title(issue.resource_link);
        });
        return setIssues(issues);
      }
    );

  useEffect(() => {
    fetchIssues();

    return () => {
      setIssues([]);
    };
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="px-10 py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="flex items-center py-2 font-semibold">
          <h2 className="px-2">Issues</h2>
        </div>
        <div className="w-full flex flex-col">
          <div className="w-full flex py-2 items-center justify-center">
            <div className="w-3/5 flex items-center bg-gray-100">
              <div className="">
                <svg
                  className="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5893"
                  width="28"
                  height="28"
                >
                  <path
                    d="M469.333 192c153.174 0 277.334 124.16 277.334 277.333 0 68.054-24.534 130.411-65.216 178.688L846.336 818.24l-48.341 49.877L630.4 695.125a276.053 276.053 0 0 1-161.067 51.542C316.16 746.667 192 622.507 192 469.333S316.16 192 469.333 192z m0 64C351.51 256 256 351.51 256 469.333s95.51 213.334 213.333 213.334 213.334-95.51 213.334-213.334S587.157 256 469.333 256z"
                    p-id="5894"
                    fill="#bfbfbf"
                  ></path>
                </svg>
              </div>
              <input
                className="w-full h-8 px-2 bg-gray-100 focus:outline-none"
                type="text"
                placeholder="search issues"
              />
            </div>
            <div className="w-2/5 flex flex-row items-center justify-center">
              <div className="flex items-center mx-auto">
                <svg
                  className="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4297"
                  width="28"
                  height="28"
                >
                  <path
                    d="M509.87008 193.80224a20.41856 20.41856 0 0 0-14.47936-6.00064l-265.35936-0.02048a20.48 20.48 0 0 0-20.48 20.39808l-0.94208 266.3424a20.43904 20.43904 0 0 0 6.00064 14.56128l348.0576 348.0576a20.41856 20.41856 0 0 0 28.95872 0l266.32192-266.32192a20.45952 20.45952 0 0 0 0-28.95872L509.87008 193.80224z m67.2768 599.90016L249.61024 466.14528l0.83968-237.40416 236.48256 0.02048 327.5776 327.5776-237.3632 237.3632z"
                    fill="#8a8a8a"
                    p-id="4298"
                  ></path>
                  <path
                    d="M417.01376 396.20608m-53.4528 0a53.4528 53.4528 0 1 0 106.9056 0 53.4528 53.4528 0 1 0-106.9056 0Z"
                    fill="#8a8a8a"
                    p-id="4299"
                  ></path>
                </svg>
                <div className="flex items-center border-2 rounded-md px-2 py-1">
                  <div className="font-semibold ml-2 ">Labels</div>
                  <div className="ml-2">5</div>
                </div>
              </div>
              <div className="flex items-center mx-auto">
                <svg
                  className="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5370"
                  width="24"
                  height="24"
                >
                  <path
                    d="M512 64H448v128H96l-32 32v256l32 32H448v448h64V512h287.36l21.76-8.32 139.52-128v-47.36l-139.52-128L800 192H512V64z m274.56 384H128V256h658.56l104.32 96L786.56 448zM320 320h320v64H320V320z"
                    p-id="5371"
                    fill="#8a8a8a"
                  ></path>
                </svg>
                <div className="flex items-center border-2 rounded-md px-2 py-1">
                  <div className="font-semibold ml-2">Milestone</div>
                  <div className="ml-2">4</div>
                </div>
              </div>
              <div className="">
                <Link to="new">
                  <button className="h-10 px-4 font-semibold rounded-md border bg-green-500 text-white">
                    New issue
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="issues-container flex flex-col border-2">
            <div className="issues-container-header flex justify-between px-4 py-2 border-b-2 bg-gray-100">
              <div className="flex">
                <div className="flex items-center">
                  <svg
                    className="issue-opened mr-2"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                    <path
                      fillRule="evenodd"
                      d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                    ></path>
                  </svg>
                  <div>{issues.length} Open</div>
                </div>
                <div className="flex items-center px-2">
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="8103"
                    width="24"
                    height="24"
                  >
                    <path
                      d="M859.022222 279.893333c-11.377778-11.377778-29.582222-11.377778-39.822222 0L434.631111 669.013333 223.004444 453.973333c-11.377778-11.377778-29.582222-11.377778-39.822222 0-11.377778 11.377778-11.377778 29.582222 0 39.822223l232.106667 235.52c5.688889 5.688889 12.515556 7.964444 20.48 7.964444s14.791111-3.413333 20.48-7.964444l405.048889-409.6c9.102222-11.377778 9.102222-29.582222-2.275556-39.822223z"
                      p-id="8104"
                      fill="#8a8a8a"
                    ></path>
                  </svg>
                  <div>{issues.length} Closed</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  <div>Author</div>
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="31848"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M284.444444 398.222222h455.111112l-227.896889 284.444445z"
                      fill="#8a8a8a"
                      p-id="31849"
                    ></path>
                  </svg>
                </div>
                <div className="flex items-center ml-4">
                  <div>Label</div>
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="31848"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M284.444444 398.222222h455.111112l-227.896889 284.444445z"
                      fill="#8a8a8a"
                      p-id="31849"
                    ></path>
                  </svg>
                </div>
                <div className="flex items-center ml-4">
                  <div>Sort</div>
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="31848"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M284.444444 398.222222h455.111112l-227.896889 284.444445z"
                      fill="#8a8a8a"
                      p-id="31849"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            {issues.length ? (
              issues.map((issue) => (
                <div
                  className="issues-item flex flex-row items-center justify-between hover:bg-gray-100 border-b-2"
                  key={issue.issue_number}
                >
                  <div className="flex flex-col px-4 py-2">
                    <div className="flex items-center issue-header text-base">
                      <svg
                        className="issue-opened mr-2"
                        viewBox="0 0 16 16"
                        version="1.1"
                        width="16"
                        height="16"
                        aria-hidden="true"
                      >
                        <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                        <path
                          fillRule="evenodd"
                          d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                        ></path>
                      </svg>
                      <Link
                        className="text-slate-800 font-semibold hover:text-blue-600"
                        to={`${pathname}/${issue.issue_number}`}
                      >
                        {issue.title}
                      </Link>
                      {issue.tags.map((tag) => (
                        <div
                          key={tag?.name}
                          className={`h-4 flex items-center px-2 py-1 ml-1 text-xs text-white rounded-full shadow-sm ${
                            tag?.style?.startsWith("bg-") ? tag?.style : ""
                          }`}
                          style={
                            tag?.style?.startsWith("#")
                              ? { backgroundColor: tag?.style }
                              : {}
                          }
                        >
                          <div>{tag?.name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="issue-meta text-xs">
                      <Link to={`${issue.issue_number}`}>
                        {`#${issue.issue_number} opened 3 days ago by moviezhou`}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center mr-4">
                    <svg
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2139"
                      width="18"
                      height="18"
                    >
                      <path
                        d="M895.469672 127.981836H127.941927c-35.322483 0-63.956637 28.634154-63.956637 63.956638v511.693008c0 35.322483 28.634154 63.956637 63.956637 63.956637h127.921462v160.1597c0 0.048095 0.00921 0.093121 0.010233 0.141216 0.214894 17.477047 14.44192 31.581276 31.970132 31.581276 10.175757 0 19.234063-4.758374 25.091468-12.165064l180.350554-179.717128H895.468648c35.322483 0 63.956637-28.634154 63.956638-63.956637V191.938474c0.001023-35.322483-28.633131-63.956637-63.955614-63.956638z m0 543.92306c0 17.520025-14.202467 31.722492-31.722493 31.722493H456.955336L319.824119 838.711993V703.627389H159.66442c-17.520025 0-31.722492-14.202467-31.722493-31.722493V223.665059c0-17.520025 14.202467-31.722492 31.722493-31.722492h704.082759c17.520025 0 31.722492 14.202467 31.722493 31.722492v448.239837z"
                        p-id="2140"
                        fill="#8a8a8a"
                      ></path>
                      <path
                        d="M767.54821 352.101243c0 17.520025-14.202467 31.722492-31.722492 31.722493H287.585881c-17.520025 0-31.722492-14.202467-31.722492-31.722493v-0.515746c0-17.520025 14.202467-31.722492 31.722492-31.722492h448.239837c17.520025 0 31.722492 14.202467 31.722492 31.722492v0.515746zM639.627772 480.022705c0 17.520025-14.202467 31.722492-31.722492 31.722492H287.585881c-17.520025 0-31.722492-14.202467-31.722492-31.722492v-0.515747c0-17.520025 14.202467-31.722492 31.722492-31.722492h320.318376c17.520025 0 31.722492 14.202467 31.722492 31.722492v0.515747z"
                        p-id="2141"
                        fill="#8a8a8a"
                      ></path>
                    </svg>
                    <div className="ml-2">{issue.comments_count}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col py-6 items-center justify-center font-semibold text-xl text-gray-600">
                <svg
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2763"
                  width="48"
                  height="48"
                >
                  <path
                    d="M792.67712 230.8608c-71.75424-72.41472-171.34464-116.32-280.65664-116.32-108.70016 0-207.02336 43.264-278.45888 114.14912l-2.5152 2.176a397.184 397.184 0 0 0-116.50688 280.64256c0 110.06848 44.78208 209.4848 116.50688 281.61024 72.04352 71.808 171.02976 116.352 280.97408 116.352a395.73504 395.73504 0 0 0 278.43072-114.176l2.22592-2.176c71.72736-72.12032 116.79616-171.53024 116.79616-281.61024 0-109.11232-45.07008-208.81792-116.79616-280.6528z m-62.35776 499.54432l-1.85088 1.8816a306.84544 306.84544 0 0 1-216.448 89.05472c-85.51552 0-162.58816-35.10656-218.32704-90.93632a308.352 308.352 0 0 1 0-437.12l1.5616-2.20032c56.08448-54.2336 132.49408-88.44032 216.76544-88.44032a307.8208 307.8208 0 0 1 218.29888 90.32832v0.31872A305.95968 305.95968 0 0 1 820.864 511.50848c0 85.93024-34.176 163.0912-90.54464 218.89152z"
                    fill="#8a8a8a"
                    p-id="2764"
                  ></path>
                </svg>
                <div>There are no open issues</div>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-4">
            {/* <Pagination total={50} itemRender={itemRender} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issues;
