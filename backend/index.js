const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/index");
const cookieParser = require("cookie-parser");
// const { app, server } = require("./socket/index");
const { createServer } = require("http");
const { Server } = require("socket.io");
const getUserDetailsFromToken = require("./helpers/getUserDetailsFromToken");
const User = require("./models/User");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");
const getConversationDetails = require("./helpers/getConversationsDetails");



// middlewares
const app = express();
dotenv.config();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
// app.options('*', cors()); // Enable pre-flight across the board
app.use(express.json());
app.use(cookieParser());


// routes
app.use("/api", apiRoutes);


// socket connection 
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
        transports: ['websocket', 'polling'],
    },
    allowEIO3: true
});

// checking whether user is online or not
const onlineUser = new Set();

io.on("connection", async (socket) => {
    console.log("User Connected. Socket Id :- ", socket.id);


    // console.log("socket >>", socket);
    const token = socket.handshake.headers.cookie
    const tokenn = token?.split("=")[1];
    // console.log("token >>", tokenn);



    // extracting user details from token
    const user = await getUserDetailsFromToken(tokenn);
    console.log("User ", user);



    // create a room
    socket.join(user?._id?.toString());
    onlineUser.add(user?._id?.toString());



    // send all the users which are online to the frontend
    io.emit("onlineUser", Array.from(onlineUser));



    // extracting user detail from userId
    socket.on("message-page", async (userId) => {

        const userDetails = await User.findById(userId).select("-password");

        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            online: onlineUser.has(userId),
            profile_pic: userDetails?.profile_pic
        }
        // event for sending details to frontend
        socket.emit("message-user", payload);


        // sending all the old messsages of the conversation
        const getConversation = await Conversation.findOne({
            "$or": [
                { sender: user?._id, receiver: userId },
                { sender: userId, receiver: user?._id }
            ]
        }).populate("messages").sort({ updatedAt: -1 });

        socket.emit("messages", getConversation?.messages || []);
    })


    // new message
    socket.on("new-message", async (data) => {

        // first check whether conversation between them already exist
        let conversation = await Conversation.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        });

        // if conversation does not exist already , then create new conversation
        if (!conversation) {
            const newConversation = new Conversation({
                sender: data?.sender,
                receiver: data?.receiver
            });
            conversation = await newConversation.save();
        }

        // save message in database
        const newMessage = new Message({
            text: data?.text,
            imageUrl: data?.imageUrl,
            videoUrl: data?.videoUrl,
            msgByUserId: data?.msgByUserId
        });

        const savedMessage = await newMessage.save();
        console.log("new message >>", savedMessage);

        // pushing message in the conversation
        const updateConversation = await Conversation.updateOne({ _id: conversation._id }, {
            "$push": { messages: savedMessage?._id }
        });

        // sending all the messages in the conversation to frontend
        const getConversation = await Conversation.findOne({ _id: conversation._id }).populate("messages").sort({ updatedAt: -1 });
        console.log("conversation >>", getConversation);


        // sending all the conversation messages between both of them to the frontend
        io.to(data?.sender).emit("messages", getConversation?.messages || []);
        io.to(data?.receiver).emit("messages", getConversation?.messages || []);


        // sending conversation to both sender and receiver sidebar when new message is added
        const conversationsSender = await getConversationDetails(data?.sender);
        const conversationReceiver = await getConversationDetails(data?.receiver);
        io.to(data?.sender).emit("sidebar-conversations", conversationsSender);
        io.to(data?.receiver).emit("sidebar-conversations", conversationReceiver);

    })


    // sending details of all the conversation that user had in the past to the sidebar
    socket.on('sidebar', async (currUserId) => {

        const conversations = await getConversationDetails(currUserId);
        // sending all conversations details to sidebar (frontend)
        socket.emit("sidebar-conversations", conversations);
    })



    // updating seen status of messages
    // secondUserId :- means user jiske sath hm bat kr rahe h
    socket.on("seen", async (secondUserId) => {

        const conversation = await Conversation.findOne({
            "$or": [
                { sender: user?._id, receiver: secondUserId },
                { sender: secondUserId, receiver: user?._id }
            ]
        });

        const conversationMessagesId = conversation?.messages || [];
        const updateMessages = await Message.updateMany(
            { _id: { "$in": conversationMessagesId }, msgByUserId: secondUserId },
            { "$set": { seen: true } }
        )
        // sending updated conversation messages to all the users
        const conversationsSender = await getConversationDetails(user?._id?.toString());
        const conversationReceiver = await getConversationDetails(secondUserId);
        io.to(user?._id?.toString()).emit("sidebar-conversations", conversationsSender);
        io.to(secondUserId).emit("sidebar-conversations", conversationReceiver);
    })



    // disconnnect
    socket.on("disconnect", () => {
        onlineUser.delete(user?._id?.toString());
        console.log("User disconnected. Socket Id:- ", socket.id);
    })
})




// connecting database and listening server
const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.MONGO_URL).then(server.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
    console.log("Database is connected successfully ...");
})).catch((err) => {
    console.log(`Error in connecting of database or server ${err}`);
})