import {forwardRef, useImperativeHandle, useState} from "react";
import {useAppDispatch} from "../../redux/hooks";
import {apiCatcher} from "../../utils/apiChecker.js";
import {getContacts} from "../../services/API/notifications";
import ContactEntry from "./ContactEntry.jsx";

function _Contacts({openContact}, ref) {
    const [contacts, setContacts] = useState([]);

    const dispatch = useAppDispatch();
    const _getContacts = _ => apiCatcher(dispatch, getContacts);

    useImperativeHandle(ref, () => ({
        refresh:
            () => _getContacts() //update all
                .then(contacts => {
                    setContacts([...contacts]);
                    // auto open the first contact
                    if (contacts.length > 0) {
                        openContact(contacts[0].id, contacts[0].username);
                    }
                }),
        update:
            (id, content, time) => {
                //update Contact
                setContacts(prevContacts => {
                    const contact = prevContacts.find(ele => ele.id === id);
                    contact.content = content;
                    contact.time = time;

                    prevContacts.sort((a, b) => a.time - b.time);
                    return prevContacts;
                })
            },
    }), []);

    const contactsList = contacts.map(contact => {
        return (<ContactEntry openContact={openContact}
                              name={contact.username}
                              key={`contact_entry_${contact.id}`}
                              id={contact.id}
                              text={contact.text}
                              type={contact.type}
                              time={contact.time}/>)
    });

    return <ul>{contactsList}</ul>

}

export const Contacts = forwardRef(_Contacts);