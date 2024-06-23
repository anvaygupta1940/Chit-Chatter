import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import Avatar from "../components/Avatar";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import uploadFile from '../helpers/uploadFile';
import CloseIcon from '@mui/icons-material/Close';
import Loading from './Loading';
import bgImage from "../assets/wallapaper.jpeg"
import SendIcon from '@mui/icons-material/Send';
import moment from "moment";



const Message = () => {
    const [userData, setUserData] = useState({
        _id: "",
        name: "",
        email: "",
        online: false,
        profile_pic: ""
    })
    const [messageData, setMessageData] = useState({
        text: "",
        imageUrl: "",
        videoUrl: ""
    });
    const [loading, setLoading] = useState(false);
    const [allMessages, setAllMessages] = useState([]);
    const user = useSelector(state => state?.user);
    const params = useParams();
    const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
    const socketConnection = useSelector(state => state?.user?.socketConnection);

    const currentMessage = useRef();

    // use effect so that when new message will be inserted the scroll will move downwards
    useEffect(() => {
        if (currentMessage.current) {
            currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [allMessages]);

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        setLoading(true);

        const uploadImageCloudinary = await uploadFile(file);

        setOpenImageVideoUpload(false);
        setLoading(false);

        setMessageData((prev) => {
            return {
                ...prev,
                imageUrl: uploadImageCloudinary?.url
            }
        });
    }

    const handleClearUploadImage = () => {
        setMessageData((prev) => {
            return {
                ...prev,
                imageUrl: ""
            }
        });
    }

    const handleUploadVideo = async (e) => {
        const file = e.target.files[0];
        setLoading(true);

        const uploadImageCloudinary = await uploadFile(file);

        setOpenImageVideoUpload(false);
        setLoading(false);

        setMessageData((prev) => {
            return {
                ...prev,
                videoUrl: uploadImageCloudinary?.url
            }
        });
    }

    const handleClearUploadVideo = () => {
        setMessageData((prev) => {
            return {
                ...prev,
                videoUrl: ""
            }
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setMessageData((prev) => {
            return {
                ...prev,
                text: value
            }
        })
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (messageData?.text || messageData?.imageUrl || messageData?.videoUrl) {
            if (socketConnection) {
                socketConnection.emit("new-message", {
                    sender: user._id,
                    receiver: params.userId,
                    text: messageData?.text,
                    imageUrl: messageData?.imageUrl,
                    videoUrl: messageData?.videoUrl,
                    msgByUserId: user?._id
                });

                setMessageData({
                    text: "",
                    imageUrl: "",
                    videoUrl: ""
                });
            }
        }
    }



    // this useEffect will run as long as we have socket Connection and when params value changes
    useEffect(() => {
        if (socketConnection) {
            // triggering event which will get the details of the user through userId
            socketConnection.emit("message-page", params.userId);

            // listening event to get user details
            socketConnection.on("message-user", (data) => {
                // console.log("payload >>", data);
                setUserData(data);
            })

            // getting all the messages of the conversation
            socketConnection.on("messages", (data) => {
                // console.log("Conversation messages >>", data);
                setAllMessages(data);
            })

            // updating seen status of the messsages 
            socketConnection.emit("seen", params.userId);

        }
    }, [socketConnection, params.userId, user]);


    return (
        <div className=' w-full h-full bg-no-repeat bg-cover border-black border-l-2' style={{ backgroundImage: `url(${bgImage})` }}>

            {/* receiver info  */}
            <header className=' sticky top-0 h-16 w-full bg-white flex items-center px-4 justify-between'>
                {
                    <Link to={"/"} className=' lg:hidden'>
                        <ArrowBackIosIcon></ArrowBackIosIcon>
                    </Link>
                }
                <div className=' flex gap-3 items-center'>
                    <div>
                        <Avatar
                            width={50}
                            height={50}
                            imageUrl={userData?.profile_pic}
                            name={userData?.name}
                            userId={userData?._id}
                        ></Avatar>
                    </div>
                    <div>
                        <h1 className=' my-0 font-semibold text-ellipsis line-clamp-1 text-[18px]'>{userData?.name}</h1>
                        <p className=' -my-1 text-gray'>{userData?.online ? <span className=' text-primary font-bold'>online</span> : <span className=' text-slate-500 '>offline</span>}</p>
                    </div>
                </div>

                <button className=' hover:text-primary'>
                    <MoreVertIcon></MoreVertIcon>
                </button>
            </header>


            {/* Show all messages */}
            <section className=' h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar bg-slate-200 bg-opacity-50 relative'>




                {/* display all messages */}
                <div className=' flex gap-2 flex-col py-2 mx-2' ref={currentMessage}>
                    {
                        allMessages?.map((msg, index) => {
                            return (
                                <div className={` w-fit max-w-[280px] md:max-w-sm lg:max-w-md rounded p-1 ${msg?.msgByUserId === user?._id ? " ml-auto bg-teal-200" : "bg-white"}`} key={index}>
                                    <div className=' w-full '>
                                        {
                                            msg?.imageUrl && (
                                                <img
                                                    src={msg?.imageUrl}
                                                    alt='imageUrl'
                                                    className=' w-full h-full object-scale-down'>

                                                </img>
                                            )
                                        }
                                        {
                                            msg?.videoUrl && (
                                                <video
                                                    src={msg?.videoUrl}
                                                    alt='videoUrl'
                                                    className=' w-full h-full object-scale-down'
                                                    controls
                                                >
                                                </video>
                                            )
                                        }
                                    </div>
                                    <p className=' px-2'>{msg?.text}</p>
                                    <p className=' text-xs  w-fit ml-auto'>{moment(msg?.createdAt).format('hh:mm')}</p>
                                </div>
                            )
                        })
                    }
                </div>


                {/* displaying upload image */}
                {
                    messageData.imageUrl && (
                        <div className=' w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded p-2 sticky bottom-0'>
                            <button className=' absolute top-0 right-0 bg-white m-3 rounded hover:text-white hover:bg-black' onClick={handleClearUploadImage}>
                                <CloseIcon></CloseIcon>
                            </button>
                            <div className=' bg-white p-4 rounded'>
                                <img
                                    src={messageData.imageUrl}
                                    className=' aspect-square w-full h-full max-w-sm object-scale-down'
                                    alt='uploadImage'>
                                </img>
                            </div>
                        </div>
                    )
                }

                {/* displaying upload video */}
                {
                    messageData.videoUrl && (
                        <div className=' w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded p-2 sticky bottom-0'>
                            <button className=' absolute top-0 right-0 bg-white m-3 rounded hover:text-white hover:bg-black' onClick={handleClearUploadVideo}>
                                <CloseIcon></CloseIcon>
                            </button>
                            <div className=' bg-white p-4 rounded'>
                                <video
                                    src={messageData?.videoUrl}
                                    className=' aspect-video w-full h-full max-w-sm object-scale-down'
                                    controls
                                    autoPlay
                                    muted>
                                </video>
                            </div>
                        </div>
                    )
                }

                {
                    loading && (
                        <div className=' w-full h-full flex justify-center items-center sticky bottom-0'>
                            <Loading></Loading>
                        </div>
                    )
                }


            </section>


            {/* send message */}
            <section className=' h-16 bg-white flex items-center px-4'>

                <div className=' relative'>

                    <button className=' w-11 h-11 rounded-full flex justify-center items-center hover:bg-primary hover:text-white'
                        onClick={() => setOpenImageVideoUpload(!openImageVideoUpload)}>
                        <AddIcon></AddIcon>
                    </button>

                    {/* image and video upload pop-up */}
                    {
                        openImageVideoUpload && (
                            <div className=' absolute bottom-16 bg-white w-36 rounded shadow-md p-4'>
                                <form>
                                    <label className=' flex gap-3 text-primary cursor-pointer hover:bg-slate-200 p-2' htmlFor='uploadImage'>
                                        <div>
                                            <ImageIcon></ImageIcon>
                                        </div>
                                        <p className=' font-semibold'>Image</p>
                                    </label>
                                    <label className=' flex gap-3 text-purple-500 cursor-pointer hover:bg-slate-200 p-2' htmlFor='uploadVideo'>
                                        <div>
                                            <VideocamIcon></VideocamIcon>
                                        </div>
                                        <p className=' font-semibold'>Video</p>
                                    </label>

                                    <input type='file' id='uploadImage' className=' hidden' onChange={handleUploadImage}></input>
                                    <input type='file' id='uploadVideo' className=' hidden' onChange={handleUploadVideo}></input>
                                </form>
                            </div>
                        )
                    }


                </div>

                <form className=' w-full h-full flex gap-3' onSubmit={handleSendMessage}>
                    <input type='text'
                        placeholder='Type your Message ...'
                        className=' w-full h-full py-1 px-4 outline-none'
                        value={messageData?.text}
                        onChange={handleChange}
                    >
                    </input>
                    <button className=' text-primary hover:text-secondary' type='submit'>
                        <SendIcon></SendIcon>
                    </button>
                </form>
            </section>
        </div>
    )
}

export default Message
