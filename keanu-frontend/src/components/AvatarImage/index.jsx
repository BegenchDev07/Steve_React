import defaultAvatar from "/img/defaultAvatar.png";
import {useAppSelector} from "../../redux/hooks";
import {useEffect, memo, useState} from "react";
import {getUserAvatar} from "../../services/API/user/index.ts";
import {readAsImage} from "../../utils/reader.js";

const MODE = {init: 1, cur: 2, other: 4};

const AvatarImage = ({avatar = null, width = 8, communityRole = null, className = null}) => {
    const curUsrName = useAppSelector((state) => state.auth?.user?.username);
    const [otherUsrName] = useState(avatar ?? curUsrName);
    const [dataURL, setDataURL] = useState(defaultAvatar);
    const [mode, setMode] = useState(MODE.init);

    const getAvatar = () => {
        if (mode & MODE.init) {
            const avatarName = (otherUsrName === curUsrName) ? curUsrName : otherUsrName;
            getUserAvatar(avatarName)
                .then((blob) => {
                    if (blob) {
                        readAsImage(blob)
                            .then((img) => {
                                setDataURL(img.src)
                            });
                    } else {
                        setDataURL(defaultAvatar)
                    }
                })
        }
    }

    useEffect(_ => {
        getAvatar();
    }, [])

    return (
        <>{<img
            className={(className === null) ? `top-1/2 inline-block h-${width} w-${width} rounded-full border-2 border-white` : className}
            src={dataURL}
            alt="Avatar"
        />}</>
    );
};

export default memo(AvatarImage);
  