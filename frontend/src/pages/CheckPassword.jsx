import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import SummaryApi from '../common';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';



const CheckPassword = () => {

    const [data, setData] = useState({
        password: "",
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // console.log("data>>", data);

        const res = await fetch(SummaryApi.checkPassword.url, {
            method: SummaryApi.checkPassword.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                ...data,
                userId: location?.state?._id
            })
        });


        const result = await res.json();

        if (result.error) {
            toast.error(result.message)
        }
        else {
            dispatch(setToken(result?.token));
            localStorage.setItem('token', result?.token);
            toast.success(result?.message);
            setData({
                password: ""
            });
            navigate("/");
        }
    }


    const location = useLocation();
    // console.log("location >>", location);

    useEffect(() => {
        if (!location?.state?.name) {
            navigate("/email");
        }
    }, []);
    return (
        <div className=' max-w-sm lg:max-w-md bg-white w-full mt-4 mx-auto p-4 rounded'>


            <div className=' flex items-center justify-center mb-3 flex-col gap-1'>
                <Avatar
                    width={70}
                    height={70}
                    name={location?.state?.name}
                    imageUrl={location?.state?.profile_pic}
                >
                </Avatar>
                <h2 className=' text-xl font-bold'>{location?.state?.name}</h2>
            </div>


            <form className=' mt-4 grid gap-3' onSubmit={handleSubmit}>

                <div className=' flex flex-col gap-2'>
                    <label htmlFor='password'>Password :</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={data.password}
                        placeholder='Enter your Password'
                        required
                        className=' bg-slate-200 px-2 py-2 rounded focus:outline-primary'
                        onChange={handleChange}>
                    </input>
                </div>
                <button type='submit' className=' bg-primary text-white text-lg py-2 leading-relaxed tracking-wide rounded font-bold hover:bg-secondary mt-2'>Login</button>
            </form>

            <p className=' my-3 text-center'><Link to={"/forgot-password"} className=' hover:text-primary hover:underline font-semibold'>Forgot password ?</Link></p>
        </div>
    )
}

export default CheckPassword;
