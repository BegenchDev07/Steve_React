import { useState, useEffect } from "react";
import "/src/assets/css/index.css";
import { getContacts } from "/src/services/API/notifications";
import { apiCatcher } from "/src/utils/apiChecker";
import { useAppDispatch, useAppSelector } from "/src/redux/hooks";
import testDB from "./testDB.json";
import AvatarImage from "/src/components/AvatarImage";
import { useNavigate } from "react-router-dom";
import { fetchImage, getS3 } from "/src/utils/reader";
import "./index.css";

export default function Notification() {
  const dispatch = useAppDispatch();
  const [contacts, setContacts] = useState();
  const [fakeMsg, setfakeMsg] = useState();
  const navigate = useNavigate();

  const fetchContacts = () => {
    apiCatcher(dispatch, getContacts).then(async (rawContacts) => {
      console.log(rawContacts);
      console.log(rawContacts["contacts"]);
      const s3 = getS3();

      const contactsWithAvatars = await Promise.all(
        rawContacts["contacts"].map(async (rawContact) => {
          const avatar = await fetchImage(
            s3,
            `${rawContact["conversation_partner_username"]}/.profile/avatar.png`
          );
          return {
            ...rawContact,
            avatar: avatar,
          };
        })
      );

      setContacts(contactsWithAvatars);
    });
  };

  const handleNavigation = (contact) => {
    navigate(
      `/notification/${contact["conversation_partner_id"]}/${contact["conversation_partner_username"]}`
    );
  };

  useEffect(() => {
    setfakeMsg(testDB);
    console.log(fakeMsg);

    fetchContacts();
    console.log(contacts);
  }, []);

  return (
    <div class="container">
      <div class="sidebar">
        <div class="contact">Contact 1</div>
        <div class="contact">Contact 2</div>
        <div class="contact">Contact 3</div>
        <div class="contact">Contact 4</div>
        <div class="contact">Contact 5</div>
        <div class="contact">Contact 6</div>
        <div class="contact">Contact 7</div>
        <div class="contact">Contact 8</div>
        <div class="contact">Contact 9</div>
        <div class="contact">Contact 10</div>
        <div class="contact">Contact 11</div>
        <div class="contact">Contact 12</div>
        <div class="contact">Contact 13</div>
        <div class="contact">Contact 14</div>
      </div>
      <div className="main-area">
        <div className="main-content">Main content here</div>
        <div className="message-section">
          <input type="text" placeholder="Type a message..." className="message-input" />
          <button className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
}
