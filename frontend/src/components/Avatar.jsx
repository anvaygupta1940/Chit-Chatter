import React from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useSelector } from 'react-redux';

const Avatar = ({ name, userId, imageUrl, width, height }) => {

    const onlineUser = useSelector((state) => state.user.onlineUser);

    let avatarName = "";
    if (name) {
        const splitName = name?.split(" ");

        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0];
        } else {
            avatarName = splitName[0][0]
        }
    }

    const bgColor = [
        "bg-gray-200",
        "bg-slate-200",
        "bg-red-200",
        "bg-teal-200",
        "bg-green-200",
        "bg-yellow-200",
        "bg-cyan-200",
        "bg-sky-200",
        "bg-blue-200"
    ]
    const random = Math.floor(Math.random() * 5);

    const isOnline = onlineUser.includes(userId);


    return (
        <div className=' rounded-full relative' style={{ width: width + "px", height: height + "px" }}>
            {
                imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        width={width}
                        height={height}
                        className=' w-full h-full overflow-hidden rounded-full object-fit'>
                    </img>
                ) : (
                    name ? (
                        <div className={`rounded-full overflow-hidden ${bgColor[random]} font-bold text-xl shadow-md border-2 border-slate-500 flex justify-center items-center`} style={{ width: width + "px", height: height + "px" }}>
                            {avatarName}
                        </div>
                    ) : (
                        <AccountCircleOutlinedIcon style={{ width: width + "px", height: height + "px" }}></AccountCircleOutlinedIcon>

                    )
                )
            }

            {
                isOnline && (
                    <p className=' bg-green-600 rounded-full p-1 absolute bottom-2 z-10 right-0'></p>
                )
            }
        </div>
    )
}

export default Avatar
