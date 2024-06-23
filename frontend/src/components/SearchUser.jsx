import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import SummaryApi from '../common';
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';


const SearchUser = ({ onClose }) => {
    const [searchedUser, setSearchedUser] = useState([]);
    const [searching, setSearching] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearchUser = async () => {


        try {
            setLoading(true);
            const res = await fetch(SummaryApi.searchUser.url, {
                method: SummaryApi.searchUser.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    search: `${searching}`
                })
            });
            setLoading(false);
            const result = await res.json();
            if (result.error) {
                toast.error(result.message);
            } else {
                setSearchedUser(result.data);
                // console.log("result >>", result);
            }

        } catch (err) {
            console.log("error inside in frontend >>", err);
        }


    }

    useEffect(() => {
        handleSearchUser();
    }, [searching]);


    return (
        <div className=' fixed top-0 right-0 left-0 bottom-0 bg-slate-700 bg-opacity-40 p-2 z-10'>

            <div className=' w-full max-w-lg  mx-auto mt-10'>


                {/* search container */}
                <div className=' bg-white flex items-center h-14 p-2 rounded overflow-hidden'>
                    <input
                        type='text'
                        placeholder='Search user by name,email...'
                        className=' w-full py-1 px-2 outline-none'
                        value={searching}
                        onChange={(e) => setSearching(e.target.value)}
                    >
                    </input>
                    <div className=' w-14 h-14 flex justify-center items-center'>
                        <SearchIcon style={{ fontSize: 25 }}></SearchIcon>
                    </div>
                </div>


                {/* searched result container */}
                <div className=' bg-white w-full rounded mt-2 p-4'>
                    {/* no user found */}
                    {
                        searchedUser.length === 0 && !loading && (
                            <p className=' text-center text-slate-500'>No user found!</p>
                        )
                    }
                    {/* loading */}
                    {
                        loading && (
                            <Loading></Loading>
                        )
                    }
                    {/* searched result */}
                    {
                        searchedUser.length !== 0 && !loading && (
                            searchedUser.map((user, index) => {
                                return (
                                    <UserSearchCard key={user._id} user={user} onClose={onClose}></UserSearchCard>
                                )
                            })
                        )
                    }
                </div>

            </div>

            <button className=' absolute top-0 right-0 bg-white m-3 rounded hover:text-white hover:bg-black' onClick={onClose}>
                <CloseIcon></CloseIcon>
            </button>
        </div>
    )
}

export default SearchUser
