import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar.';
import logo from "../assets/logo.png"
import io from "socket.io-frontend";



function Home() {
    const user = useSelector(state => state.user);
    console.log("user info >>", user);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    // console.log("location >>", location);
    const fetchUserDetails = async () => {

        const res = await fetch(SummaryApi.userDetail.url, {
            method: SummaryApi.userDetail.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            }
        });

        const result = await res.json();
        if (result?.data?.logout) {
            dispatch(logout());
            navigate("/email");
        }
        if (result.error) {
            toast.error(result?.message);
        } else {
            dispatch(setUser(result?.data));
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [user]);

    const basePath = location.pathname === "/";


    /* Socket connection ------ */
    // const socket = io(process.env.REACT_APP_BACKEND_URL);
    useEffect(() => {

        const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
            auth: {
                token: localStorage.getItem('token')
            }
        })

        // getting list of users which are online
        socketConnection.on("onlineUser", (data) => {
            // console.log("Online user list >>", data);
            dispatch(setOnlineUser(data));
        })

        // storing socket connection in react redux
        dispatch(setSocketConnection(socketConnection));

        // if component is re-rendered
        return () => {
            socketConnection.disconnect();
        };
    }, []);


    return (
        <div className=' grid lg:grid-cols-[320px,1fr]'>

            <section className={` bg-white ${!basePath && "hidden"} lg:block`}>
                <Sidebar></Sidebar>
            </section>

            {/* message part  -> visible only at url /:id */}
            <section className={` ${basePath && "hidden"}`}>
                <Outlet></Outlet>
            </section>

            <div className={` justify-center items-center flex-col gap-2 ${!basePath ? "hidden" : "lg:flex"}`}>
                <div>
                    <img
                        src={logo}
                        alt='logo'
                        width={250}></img>
                </div>
                <p className=' text-xl text-slate-700 mt-2 font-semibold'>Select user to send message</p>
            </div>


        </div>
    );
}

export default Home
