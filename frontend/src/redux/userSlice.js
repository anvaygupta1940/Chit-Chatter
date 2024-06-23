import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    name: "",
    _id: "",
    email: "",
    profilePic: "",
    token: "",
    onlineUser: [],
    socketConnection: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.name = action.payload.name
            state._id = action.payload._id
            state.email = action.payload.email
            state.profilePic = action.payload.profile_pic
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        logout: (state, action) => {
            state.name = ""
            state._id = ""
            state.email = ""
            state.token = ""
            state.profilePic = ""
            state.socketConnection = null
        },
        setOnlineUser: (state, action) => {
            state.onlineUser = action.payload
        },
        setSocketConnection: (state, action) => {
            state.socketConnection = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } = userSlice.actions

export default userSlice.reducer