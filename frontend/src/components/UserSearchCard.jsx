import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'


const UserSearchCard = ({ user, onClose }) => {
    return (
        <Link to={"/" + user._id} onClick={onClose} className=' flex p-3 items-center gap-3 border mb-2 rounded hover:border-primary cursor-pointer'>
            <div>
                <Avatar
                    width={50}
                    height={50}
                    name={user?.name}
                    imageUrl={user?.profile_pic}
                    userId={user?._id}></Avatar>
            </div>
            <div>
                <p className=' text-ellipsis line-clamp-1 font-bold'>{user.name}</p>
                <p className=' text-ellipsis line-clamp-1 text-sm'>{user.email}</p>
            </div>
        </Link>
    )
}

export default UserSearchCard
