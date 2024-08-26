//todo: need to find a better name

import {useAppDispatch} from "../redux/hooks.js";
import {fetchImageDataURL, fetchSettings, getS3} from "../utils/reader.js";
import {apiCatcher} from "../utils/apiChecker.js";
import {listResourceItemsByTag} from "../services/API/resource/index.js";
import {useMemo, useRef, useState} from "react";
import {Masonry, MasonryContext} from "../components/Masonry/index.js";
import {ProfileDummy} from "../components/Dummy/index.js";
import {ProfileItem} from "../components/SuspenseItem/index.js";
import {BazaarWrapper, ProfileWrapper} from "../components/Wrapper/index.js";
import Tags from "../components/Tags/index.jsx";

export default function BazaarProfile() {
    const dispatch = useAppDispatch();

    // todo: the default value can be a better one
    const [tags, setTags] = useState(["brainstorm", "detective"]);
    const tagsRef = useRef(tags);

    const initData = () => {
        return Promise.resolve([]);
    }

    const getData = () => apiCatcher(dispatch, listResourceItemsByTag, 'product', tagsRef.current)
        .then(resultArr => Promise.all(resultArr.map(({resource}) => fetchSettings(resource.link)))
            .then(jsonArr =>
                Promise.resolve(resultArr.map(({resource}, index) => {
                    const {media} = jsonArr[index],
                        {url, width, height} = media.cover[0],
                        uuid = resource.uuid,
                        title = resource.title,
                        username = resource?.user?.username;
                    return {uuid, url, width, height, title,username};
                })))
        )

    const waitForever = _ => new Promise(res => setTimeout(res, 1000000));

    const fetch = ({url}) => {
        if (url === null) {
            return waitForever();
        } else if (url.startsWith("data")) { //blob
            return url;
        } else
            return fetchImageDataURL(getS3(), url);
    }

    const masonryRef = useRef();

    const handleQuery = (newTags) => {
        setTags(newTags);
        tagsRef.current = newTags;
        masonryRef.current.refresh();
    }

    const masonryContext = useMemo(() => ({
        Dummy: ProfileDummy,
        Comp: ProfileItem,
        Wrap: BazaarWrapper,
    }), []);

    return (
        <main className="w-full flex flex-col">
            <div className="pt-0 h-full flex-grow">
                <div className="p-20 flex-shrink-0">
                    <Tags onQuery={newTags => handleQuery(newTags)}/>
                </div>
                <MasonryContext.Provider value={masonryContext}>
                    <Masonry
                        initData={initData}
                        getData={getData}
                        fetch={fetch}
                        ref={masonryRef}
                        className="p-8 w-2/3 flex-grow"
                    />
                </MasonryContext.Provider>
            </div>
        </main>
    );
}