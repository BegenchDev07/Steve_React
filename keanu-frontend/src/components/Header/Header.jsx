import React, {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import logo from "/img/gamehub-logo.png";
import {useAppSelector, useAppDispatch} from "../../redux/hooks.js";
import {Link} from "react-router-dom";
import {logout} from "../../redux/actions/auth";
import UserMenu from "./UserMenu.jsx";
import NavbarSearchBox from "../NavbarSearchBox";
import AvatarImage from "../AvatarImage";
import Cart from "../Cart/Cart.jsx";
// import LastCommit from "/src/components/LastCommit";
import {USER_LOGOUT} from "../../redux/constants/userConstants.js";

function useComponentVisible(initialIsVisitable) {
    const [isComponentVisible, setIsComponentVisible] =
        useState(initialIsVisitable);
    const ref = useRef();

    const handleHideDropdown = (event) => {
        if (event.key === "Escape") {
            setIsComponentVisible(false);
        }
    };

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleHideDropdown, true);
        document.addEventListener("click", handleClickOutside, true);

        return () => {
            document.removeEventListener("keydown", handleHideDropdown, true);
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return {ref, isComponentVisible, setIsComponentVisible};
}

export default function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userObject = useAppSelector((state) => state.auth?.user);
    const [user, setUser] = useState(userObject);

    const [notification, setNotification] = useState("");

    const handleLogout = () => {
        // Dispatch the logout action which returns a Promise
        dispatch(logout(user.loginToken))
            .then(() => {
                // After logout is successful, dispatch the MENU_RELOAD action
                return dispatch({
                    type: USER_LOGOUT,
                    payload: { status: 'logout' },
                });
            })
            .then(() => {
                // After MENU_RELOAD action is dispatched, set the user to null
                setUser(null);
            })
            .then(() => {
                // Finally, navigate to the home page
                navigate('/');
            })
            .catch(error => {
                // Handle any errors that occurred during the process
                console.error('Logout failed:', error);
                // Add error handling logic if necessary
            });
    };


    const {ref, isComponentVisible, setIsComponentVisible} =
        useComponentVisible(false);

    const handleProfileBtnClick = (event) => {
        setIsComponentVisible(!isComponentVisible);
    };

    // useEffect(() => {
    //     if (user && user.loginToken) {
    //         // getUserProfile()
    //         //   .then(({ userInfo }) => {
    //         //     setUser(userInfo);
    //         //   })
    //         //   .catch((err) => {
    //         //     if (err.name && err.name === "TokenExpiredError") {
    //         //       dispatch(logout());
    //         //     } else if (err.message) {
    //         //       debugger;
    //         //     }
    //         //   });
    //         // checkNotification()
    //         //   .then((data: any) => {
    //         //     setNotification(data.invitation);
    //         //   })
    //         //   .catch((err: any) => {
    //         //     debugger;
    //         //   });
    //     }
    // }, [userState]);
    //
    // useEffect(() => {
    //     },[]
    // );

    const renderUserMenu = () => {
        return (
            <div ref={ref}>
                <div className="ml-3 relative">
                    <div>
                        <button
                            onClick={handleProfileBtnClick}
                            className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            id="user-menu"
                            aria-haspopup="true"
                        >
                            <span className="sr-only">Open user menu</span>
                            {
                                <AvatarImage avatar={user?.profile?.avatar}></AvatarImage>
                            }
                        </button>
                    </div>
                </div>
                {isComponentVisible && (
                    <UserMenu
                        username={user.username}
                        userInfo={user.profile}
                        handleLogout={handleLogout}
                    />
                )}
            </div>
        )
    }

    return (
        <nav className="w-full h-16  top-0 left-0 right-0 bg-white z-50 border-b-1 border-slate-600">
            <div className="h-full mx-auto sm:px-4">
                <div className="h-full flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link to="/">
                                <img className="h-12" src={logo} alt="logo"></img>
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-6 flex items-baseline space-x-4">
                                <NavbarSearchBox/>
                                {/* <LastCommit/> */}
                            </div>
                        </div>
                    </div>
                    {user ? (
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                <Cart/>
                                <button
                                    className="relative bg-white p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                    <span className="w-3 h-3 absolute left-3 top-3px bg-blue-500 rounded-full"></span>
                                    <Link
                                        to={"/notification"}
                                        state={{invitation: notification}}
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                            />
                                        </svg>
                                    </Link>

                                </button>

                                {renderUserMenu()}
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-3">                            
                            <Link to="/login" replace={true}>
                                Log In
                            </Link>

                            {/*<a href="/signup" className="text-black px-2">*/}
                            {/*    Sign Up*/}
                            {/*</a>*/}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}