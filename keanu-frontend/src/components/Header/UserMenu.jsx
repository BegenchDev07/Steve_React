import AvatarImage from "../AvatarImage";

export default function UserMenu({username, userInfo, handleLogout}) {
    return (
        <div
            className="absolute top-16 right-3 flex flex-col bg-white py-2 sm:py-6 px-2 shadow-xl ring-1 ring-gray-900/5 sm:px-10 z-50 rounded-lg">
            <div className="flex mx-auto max-w-md items-center">
                <AvatarImage avatar={userInfo.avatar} width={12}></AvatarImage>
                <div className="divide-y divide-gray-300/50">
                    <div className="px-4 text-base leading-7 text-gray-600">
                        <a href={`/@${username}`} className="font-semibold no-underline text-xl text-slate-700">{username}</a>
                        {/* <div className="text-sm leading-5 text-gray-500">
                            {userInfo.email}
                        </div> */}
                    </div>
                </div>
            </div>
            <hr className="mt-4"/>
            <div className="flex items-center py-2 text-base font-semibold leading-7">
                <a href="/help" className="text-slate-500 no-underline">
                    Help
                </a>
            </div>
            <div className="flex items-center py-2 text-base font-semibold leading-7">
                <a href="/settings/personal" className="text-slate-500 no-underline">
                    Settings
                </a>
            </div>
            <hr className="mt-2"/>
            <div className="flex items-center py-2 text-base font-semibold leading-7">
                <button
                    onClick={handleLogout}
                    className="no-underline hover:text-red-600"
                >
                    logout
                </button>
            </div>
        </div>
    );
}