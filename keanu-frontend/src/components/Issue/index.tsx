import React, { useState, useEffect } from "react";
import { useMatch, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import IssueComment from "../IssueComment";
import { getIssue } from "../../services/API/issues";
import { readAsText, getS3 } from "../../utils/reader";
import { apiCatcher, assertChecker } from "../../utils/apiChecker";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { CommentView, CommentPopUp } from "../Comment";
import AvatarImage from "../AvatarImage";
import {
  getComments,
  subIssue,
  checkSub,
} from "../../services/API/comments";
import "/src/assets/css/index.css";
import formatHumanReadableDate from "./utils/commentFormating";

const Issue = (props) => {
  const dispatch = useAppDispatch();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { user: paramUser, project, id } = useParams();
  const [issue, setIssue] = useState<any>();
  const [resource_link, setResourceLink] = useState<string>("");
  const [tags, setTags] = useState<any>([]);
  const [issueMarkdown, setIssueMarkdown] = useState<any>();
  const [comments, setComments] = useState<any[]>([]);
  const [subState, setSubState] = useState<any>(false);
  const user = authUser ? authUser.username : paramUser;
  const fetchIssue = (projectId, issueId) =>
    apiCatcher(dispatch, getIssue, projectId, parseInt(issueId)).then(
      ({ issue }) => {
        debugger;
        setResourceLink(issue.resource_link);
        return Promise.resolve(issue);
      }
    );

  const fetchIssueMarkdown = (resource_link: string) => {
    const s3 = getS3();

    return s3
      .downloadFile(`${user}-${project}`, resource_link)
      .then((blob: any) => {
        return readAsText(blob);
        // setIssueMarkdown(readAsText(blob));
      })
      .then((text) => setIssueMarkdown(text));
  };

  const fetchComments = async (resource_link: string) =>
    apiCatcher(dispatch, getComments, resource_link).then((result) => {
      if (result.comments) {
        setComments(result.comments);
      }
    });

  const _subIssue = (resource_link) =>
      apiCatcher(dispatch, subIssue, resource_link, "subscribe"),
    _unsubIssue = (resource_link) =>
      apiCatcher(dispatch, subIssue, resource_link, "unsubscribe");

  const subIssueClicked = async () => {
    await _subIssue(resource_link);
    setSubState(!subState);
  };

  const unsubIssueClicked = async () => {
    await _unsubIssue(resource_link);
    setSubState(!subState);
  };

  const checkSubState = (resource_link: number) =>
    apiCatcher(dispatch, checkSub, resource_link);

  useEffect(() => {
    return fetchIssue(`${user}-${project}`, id)
      .then((issue) => {
        setIssue(issue);
        return issue; // Pass the issue object to the next then
      })
      .then((issue) => {
        // Now issue object is available here
        return Promise.all([
          fetchIssueMarkdown(issue.resource_link),
          fetchComments(issue.resource_link),
          checkSubState(issue.resource_link),
        ]);
      })
      .then(([_, __, subState]) => {
        setSubState(subState.is_subscribed);
      });
  }, [id]);

  // useEffect(() => {
  //     return fetchIssue(`${user}-${project}`, id)
  //         .then(issue=>{
  //             setIssue(issue);
  //             fetchIssueMarkdown(issue.resource_link)})
  //         .then(_ => fetchComments(resource_link))
  //         .then(_ => checkSubState(resource_link))
  //         .then(({is_subscribed}) => setSubState(is_subscribed))
  // }, [id]);

  return (
    <div className="w-full flex flex-col">
      <div className="relative mt-10">
        <div className="h-12 text-4xl">
          <div className="inline ml-1">{issue?.title}</div>
          <div className="inline text-gray-500 ml-1 font-light">#{id}</div>
        </div>
        <div className="inline-flex h-8 items-center mt-1">
          <div className="inline-flex items-center font-semibold rounded-full bg-green-500 text-white h-8 w-24">
            <svg
              className="issue-opened ml-3 mr-2"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fill="white"
                d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
              ></path>
              <path
                fill="white"
                fillRule="evenodd"
                d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
              ></path>
            </svg>
            {issue?.status === 1 ? "Open" : "Closed"}
          </div>
          <a
            className="no-underline text-gray-600 author font-medium ml-1"
            href=""
          >
            {issue?.User?.username}
          </a>
          <div className="text-gray-600 ml-1">
            {" "}
            opened this issue {formatHumanReadableDate(
              issue?.create_time
            )} · <span className="font-semibold">{comments.length}</span>{" "}
            comments
          </div>
        </div>
        {authUser && (
          <button className="absolute right-1 bg-green-500  h-8 w-24 font-semibold text-white rounded-lg top-2">
            New issue
          </button>
        )}
      </div>
      <hr className="text-gray-600" />
      <div className="flex">
        <div className="w-9/12">
          <ContentView
            avatar={issue?.User?.avatar}
            user={issue?.User?.username}
            project={project}
            createdAt={formatHumanReadableDate(issue?.create_time)}
            title={issue?.title}
            issueMarkdown={issueMarkdown}
            // content={issue?.content}
          />
          {/*{comments.map((comment) => {*/}
          {/*  return (*/}
          {/*    <CommentView*/}
          {/*      key={comment.id}*/}
          {/*      avatar={comment.user.avatar}*/}
          {/*      user={comment.user.username}*/}
          {/*      createdAt={formatHumanReadableDate(comment.create_time)}*/}
          {/*    />*/}
          {/*  );*/}
          {/*})}*/}
          <div className="pl-14">
            <IssueComment
              projectId={`${user}-${project}`}
              issueNumber={id}
              handleSucceeded={fetchComments}
              resource_link={resource_link}
            />
          </div>
        </div>
        <div className="w-3/12 mt-8">
          <div className="ml-12">
            <div className="text-gray-500">Notifications</div>
            {!subState && (
              <button
                className="border-gray-400 bg-slate-100 border text-black w-full mt-2 h-8 rounded-lg"
                onClick={() => subIssueClicked()}
              >
                Subscribe
              </button>
            )}
            {subState && (
              <button
                className="border-gray-400 bg-slate-100 border text-black w-full mt-2 h-8 rounded-lg"
                onClick={() => unsubIssueClicked()}
              >
                Unsubscribe
              </button>
            )}
          </div>
          <div className="mt-2 ml-12">
            <div className="text-gray-500">Tags</div>
            <div className="flex">
              {tags &&
                tags.map((tag) => (
                  <div
                    key={tag.name}
                    className={`w-16 h-6 flex items-center justify-center px-2 py-2 ml-1 text-xs text-white rounded-full shadow-sm ${
                      tag?.style?.startsWith("bg-") ? tag?.style : ""
                    }`}
                    style={
                      tag?.style?.startsWith("#")
                        ? { backgroundColor: tag?.style }
                        : {}
                    }
                  >
                    <div>{tag.name}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ContentView = ({
  avatar,
  user,
  project,
  createdAt,
  title,
  issueMarkdown,
}) => {
  return (
    <div className="w-full flex mt-8">
      <AvatarImage avatar={avatar} width={12}></AvatarImage>
      <div className="ml-3 w-full border border-gray-400 rounded-xl">
        <div
          className="w-full flex flex-row items-center relative border-b border-gray-400
                      pl-4 h-12"
        >
          <a
            className="no-underline font-semibold text-gray-600 author font-medium ml-1"
            href=""
          >
            {user}
          </a>
          <div className="text-gray-600 ml-1">commented {createdAt}</div>
          <CommentPopUp permission={"admin"} />
        </div>
        <div className="w-full bg-slate-100 pl-2 border-b rounded-xl pl-4 pt-4 pb-4  ">
          {/* <ReactMarkdown className="p-2">{content}</ReactMarkdown> */}
          <ReactMarkdown className="break-all whitespace-normal p-2">
            {issueMarkdown}
          </ReactMarkdown>
          {/* {title ? (
            // <MarkdownFromURL
            //   // url={`https://keanu-1302931958.cos.ap-beijing.myqcloud.com/${user}-${project}/issues/${title}.md`}
            //   url={issueMarkdownDataURL}
            // ></MarkdownFromURL>
            <ReactMarkdown className="break-all whitespace-normal p-2">issueMarkdown"</ReactMarkdown>
          ) : null} */}
        </div>
      </div>
    </div>
  );
};

export default Issue;
