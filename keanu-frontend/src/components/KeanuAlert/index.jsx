import React, {useState, useEffect} from 'react';
import {useAppSelector} from '../../redux/hooks.js';
import AlertComponent from '../AlertComponent';

export default function KeanuAlert() {
    const {alerts} = useAppSelector(state => state.alerts);
    const [alert, setAlert] = useState({type: undefined, message: ""});
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (alerts.length > 0) {
            setAlert(alerts[alerts.length - 1]);
            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, 3000);
        }
    }, [alerts]);

    const onClose = (e) => {
        setShow(false);
    };

    return show ? (
        <AlertComponent message={alert.message}/>
    ) : null;
}
