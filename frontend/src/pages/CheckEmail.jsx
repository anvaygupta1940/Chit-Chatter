import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SummaryApi from '../common';



const CheckEmail = () => {

    const [data, setData] = useState({
        email: "",
    });
    const navigate = useNavigate();

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

        const res = await fetch(SummaryApi.checkEmail.url, {
            method: SummaryApi.checkEmail.method,
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.error) {
            toast.error(result.message)
        }
        else {
            toast.success(result.message);
            setData({
                email: "",
            });
            navigate("/password", {
                state: result?.data
            });
        }
    }


    return (
        <div className=' max-w-sm lg:max-w-md bg-white w-full mt-4 mx-auto p-4 rounded'>
            <div className=' flex items-center justify-center mb-3'>
                <AccountCircleOutlinedIcon style={{ height: "70px", width: "70px" }}></AccountCircleOutlinedIcon>
            </div>
            <h1 className=' font-semibold text-lg'>Welcome to Chat App!!</h1>

            <form className=' mt-4 grid gap-3' onSubmit={handleSubmit}>

                <div className=' flex flex-col gap-2'>
                    <label htmlFor='email'>Email :</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={data.email}
                        placeholder='Enter your email'
                        required
                        className=' bg-slate-200 px-2 py-2 rounded focus:outline-primary'
                        onChange={handleChange}>
                    </input>
                </div>
                <button type='submit' className=' bg-primary text-white text-lg py-2 leading-relaxed tracking-wide rounded font-bold hover:bg-secondary mt-2'>Let's Go</button>
            </form>

            <p className=' my-3 text-center'>New User ? <Link to={"/register"} className=' hover:text-primary hover:underline font-semibold'>Register</Link></p>
        </div>
    )
}

export default CheckEmail
