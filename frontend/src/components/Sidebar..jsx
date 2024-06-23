import React, { useEffect, useState } from 'react'
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from "./Avatar";
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import SearchUser from './SearchUser';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import { logout } from '../redux/userSlice';




const Sidebar = () => {
    const socketConnection = useSelector((state) => state?.user?.socketConnection);
    const user = useSelector(state => state.user);
    const [openEditUserInfoBox, setOpenEditUserInfoBox] = useState(false);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    // handling logout operation
    const handleLogout = () => {
        dispatch(logout());
        navigate("/email");
        localStorage.clear();
    }

    // getting details of all the conversations that user had
    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit("sidebar", user?._id);

            // getting details of all the conversations of the user
            socketConnection.on("sidebar-conversations", (data) => {
                console.log("sidebar conversations details >>", data);

                const conversationUserData = data.map((conv, index) => {

                    if (conv?.sender?._id === conv?.receiver?._id) {
                        return {
                            ...conv,
                            userDetails: conv?.sender
                        }
                    }
                    else if (conv?.sender?._id !== user?._id) {
                        return {
                            ...conv,
                            userDetails: conv?.sender
                        }
                    }
                    else {
                        return {
                            ...conv,
                            userDetails: conv?.receiver
                        }
                    }
                })
                setAllUser(conversationUserData);
            })
        }
    }, [socketConnection, user, allUser]);



    return (
        <div className=' w-full h-screen max-h-screen grid grid-cols-[48px,1fr]'>

            {/* icon container */}
            <div className=' bg-slate-100 w-12 h-full rounded-tr-md rounded-br-md py-5 text-black flex flex-col justify-between'>

                <div>
                    <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center items-center font-bold cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='chat'>
                        <ChatIcon style={{ fontSize: 30 }}></ChatIcon>
                    </NavLink>
                    <div className=' w-12 h-12 flex justify-center items-center font-bold cursor-pointer hover:bg-slate-200 rounded' title='Add friend'
                        onClick={() => setOpenSearchUser(true)}>
                        <PersonAddIcon style={{ fontSize: 30, marginLeft: -5 }}></PersonAddIcon>
                    </div>
                </div>

                <div className=''>
                    <div className='w-12 h-12 flex justify-center items-center font-bold cursor-pointer hover:bg-slate-200 rounded' title={user?.name} onClick={() => setOpenEditUserInfoBox(true)}>
                        <Avatar
                            height={40}
                            width={40}
                            name={user?.name}
                            imageUrl={user?.profilePic}
                            userId={user?._id}
                        >
                        </Avatar>
                    </div>
                    <div className=' w-12 h-12 flex justify-center items-center font-bold cursor-pointer hover:bg-slate-200 rounded' title='Logout' onClick={handleLogout}>
                        <LogoutIcon style={{ fontSize: 30 }}></LogoutIcon>
                    </div>
                </div>
            </div>


            {/* user container */}
            <div className=' bg-white'>

                <div className=' h-16 flex items-center p-4'>
                    <p className=' text-2xl font-bold text-slate-800'>Message</p>
                </div>
                <div className=' p-[0.5px] bg-slate-200'></div>

                <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {
                        allUser.length === 0 && (
                            <div className=' mt-12'>
                                <div className=' flex items-center justify-center text-slate-500'>
                                    <NorthWestIcon style={{ fontSize: 50 }}></NorthWestIcon>
                                </div>
                                <p className=' text-center text-lg text-slate-400'>Explore users to start a conversation with.</p>
                            </div>
                        )
                    }

                    {
                        allUser.map((conv, index) => {
                            return (
                                <NavLink to={'/' + conv?.userDetails?._id} key={index} className=' flex items-center gap-2 border border-transparent hover:border-primary rounded  py-3 px-3 cursor-pointer'>
                                    <div>
                                        <Avatar
                                            width={40}
                                            height={40}
                                            imageUrl={conv?.userDetails?.profile_pic}
                                            name={conv?.userDetails?.name}>
                                        </Avatar>
                                    </div>
                                    <div>
                                        <h3 className=' text-ellipsis line-clamp-1 font-bold text-base'>{conv?.userDetails?.name}</h3>
                                        <div className=' flex items-center gap-1 text-slate-500 text-xs'>
                                            <div className=''>
                                                {
                                                    conv?.lastMsg?.imageUrl && (
                                                        <div className=' flex items-center gap-1'>
                                                            <span><ImageIcon></ImageIcon></span>
                                                            {!conv?.lastMsg?.text && <p>Image</p>}
                                                        </div>
                                                    )
                                                }
                                                {
                                                    conv?.lastMsg?.videoUrl && (
                                                        <div className=' flex items-center gap-1'>
                                                            <span><VideocamIcon></VideocamIcon></span>
                                                            {!conv?.lastMsg?.text && <p>Video</p>}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <p className=' text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                                        </div>
                                    </div>
                                    {
                                        conv?.unseenMsg !== 0 && (
                                            <div className=' ml-auto w-6 h-6 bg-primary flex items-center justify-center rounded-full font-semibold text-xs text-white'>{conv?.unseenMsg}</div>
                                        )
                                    }
                                </NavLink>
                            )
                        })
                    }
                </div>
            </div>


            {/* open edit user details box */}
            {
                openEditUserInfoBox && (
                    <EditUserDetails onClose={() => setOpenEditUserInfoBox(false)} user={user}></EditUserDetails>
                )
            }

            {/* open search user box */}
            {
                openSearchUser && (
                    <SearchUser onClose={() => setOpenSearchUser(false)}></SearchUser>
                )
            }

        </div>
    )
}

export default Sidebar