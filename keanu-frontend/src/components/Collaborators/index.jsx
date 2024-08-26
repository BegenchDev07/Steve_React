import React, { useState, useEffect } from "react";
import { apiCatcher } from "../../utils/apiChecker.js";
import {
  getSearchedUsers,
  inviteCollaborator,
  getInvitations,
} from "../../services/API/project/index.ts";
import AvatarImage from "../AvatarImage/index.jsx";
import { useAppDispatch } from "/src/redux/hooks";
import { useParams } from 'react-router-dom';

const Collaborators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const dispatch = useAppDispatch();
  const { user, project } = useParams();
  const projectID = `${user}-${project}`;

  const searchingUser = (name) => {
    setSearchTerm(name);
    apiCatcher(dispatch, getSearchedUsers, name).then((users) => {
      setSearchedUsers(users);
    });
  };

  const sendInvitation = (invitee) => {
    apiCatcher(dispatch, inviteCollaborator, projectID, invitee).then((result) => {
      setSearchedUsers((prevUsers) =>
        prevUsers.filter((user) => user.username !== invitee)
      );
    });
  };

  useEffect(() => {
    apiCatcher(dispatch, getInvitations, projectID).then((invitations) => {
      if (invitations) {
        const formattedInvitations = invitations.map((invitation) => {
          let readableStatus = "";
          switch (invitation.status) {
            case 1:
              readableStatus = "Accepted";
              break;
            case 0:
              readableStatus = "Denied";
              break;
            case -1:
              readableStatus = "Pending";
              break;
          }
          return {
            invitee: invitation.invitee,
            status: readableStatus,
          };
        });
        setInvitedUsers(formattedInvitations);
      }
    });
  }, []);

  const renderSearchedNm = (usrs) => {
    return usrs.map((username) => (
      <li key={username} className="mb-2 flex items-center justify-between">
        <span className="flex items-center">
          <AvatarImage avatar={username} width={8} />
          {username}
        </span>
        <button
          className="p-2 rounded bg-green-500 text-white"
          onClick={() => sendInvitation(username)}
        >
          Invite
        </button>
      </li>
    ));
  };

  return (
    <div className="application-main w-full h-full flex flex-row">
      <div className="sm:w-full lg:w-4/5 mx-auto flex flex-row">
        <div className="flex flex-col h-screen w-full">
          <div className="flex-grow flex flex-col justify-between p-5 border border-gray-300 rounded-2xl mb-4 w-full">
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => searchingUser(e.target.value)}
                className="w-full p-2 text-base border border-gray-300 rounded-2xl mb-2"
                placeholder="Search by username"
              />
              {searchTerm && (
                <div className="border border-gray-300 rounded-2xl p-2 mt-2 w-full">
                  <ul className="list-none p-0">
                    {renderSearchedNm(searchedUsers)}
                  </ul>
                </div>
              )}
            </div>
            <button
              className="w-full py-4 rounded-2xl bg-green-500 text-white text-base"
              disabled={!searchTerm}
            >
              Select a collaborator above
            </button>
          </div>
          <div className="flex-grow border border-gray-300 rounded-2xl p-5 w-full">
            <ul className="list-none p-0">
              {invitedUsers.map((invitation) => (
                <li
                  key={invitation.invitee}
                  className="mb-2 flex items-center justify-between"
                >
                  <span className="flex items-center">
                    (Avatar) {invitation.invitee}
                  </span>
                  <button className="p-2 rounded bg-gray-500 text-white">
                    {invitation.status}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaborators;
