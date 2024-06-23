import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import uploadFile from '../helpers/uploadFile';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';

const RegisterPage = () => {

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: ""
    });
    const [uploadPhoto, setUploadPhoto] = useState("");
    const navigate = useNavigate();


    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];

        setUploadPhoto(file);

        // upload it in cloudinary and store its url in data
        const uploadImageCloudinary = await uploadFile(file);
        // console.log("cloudinary image details >>", uploadImageCloudinary);

        if (uploadImageCloudinary?.url) {
            toast.success("Image uploaded successfully ....");
        }

        setData((prev) => {
            return {
                ...prev,
                profile_pic: uploadImageCloudinary?.url
            }
        });

    }

    const handleClearUploadPhoto = (e) => {
        /*
         stopPropagation() is a method used to prevent the event from bubbling up the DOM tree. 
         When an event occurs on an element, it usually propagates, or bubbles, up to its parent
          elements, triggering their event listeners as well. By calling stopPropagation() on the 
          event object, you can stop this behavior and keep the event contained within the element
           that triggered it.
        */
        e.stopPropagation();
        e.preventDefault();

        setUploadPhoto(null);

        setData((prev) => {
            return {
                ...prev,
                profile_pic: ""
            }
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
    }

    // console.log("Upload photo details>>", uploadPhoto);

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // console.log("data>>", data);

        const res = await fetch(SummaryApi.register.url, {
            method: SummaryApi.register.method,
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
                name: "",
                email: "",
                password: "",
                profile_pic: ""
            });
            navigate("/email");
        }
    }

    // console.log("uploadPhoto >>", uploadPhoto);
    return (
        <div className=' max-w-sm lg:max-w-md bg-white w-full mt-4 mx-auto p-5 rounded'>
            <h1 className=' font-semibold text-lg'>Welcome to Chat App!!</h1>

            <form className=' mt-4 grid gap-3' onSubmit={handleSubmit}>
                <div className=' flex flex-col gap-2'>
                    <label htmlFor='name'>Name :</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={data.name}
                        placeholder='Enter your name'
                        required
                        className=' bg-slate-200 px-2 py-1 rounded focus:outline-primary'
                        onChange={handleChange}>
                    </input>
                </div>
                <div className=' flex flex-col gap-2'>
                    <label htmlFor='email'>Email :</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={data.email}
                        placeholder='Enter your email'
                        required
                        className=' bg-slate-200 px-2 py-1 rounded focus:outline-primary'
                        onChange={handleChange}>
                    </input>
                </div>
                <div className=' flex flex-col gap-2'>
                    <label htmlFor='password'>Password :</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={data.password}
                        placeholder='Enter your password'
                        required
                        className=' bg-slate-200 px-2 py-1 rounded focus:outline-primary'
                        onChange={handleChange}>
                    </input>
                </div>
                <div className=' flex flex-col gap-2'>
                    <label htmlFor='profile_pic'>Photo :
                        <div className=' bg-slate-200 h-14 rounded flex items-center justify-center cursor-pointer hover:border-primary hover:border-2'>
                            <p className=' text-md text-ellipsis line-clamp-1'>
                                {uploadPhoto?.name ? uploadPhoto?.name : "Upload Profile Photo"}
                            </p>
                            {uploadPhoto?.name && (
                                <span className=' hover:text-red-500 ml-3'
                                    onClick={handleClearUploadPhoto}>
                                    <CloseIcon></CloseIcon>
                                </span>
                            )}
                        </div>
                    </label>
                    <input
                        type='file'
                        id='profile_pic'
                        name='profile_pic'
                        className=' hidden'
                        onChange={handleUploadPhoto}>
                    </input>
                </div>
                <button type='submit' className=' bg-primary text-white text-lg py-2  rounded font-bold hover:bg-secondary mt-2'>
                    Register
                </button>
            </form>

            <p className=' my-3 text-center'>Already have account ? <Link to={"/email"} className=' hover:text-primary hover:underline font-semibold'>Login</Link></p>
        </div>
    )
}

export default RegisterPage
