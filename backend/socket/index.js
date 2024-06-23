const express = require("express");
const http = require("http");
const { Server } = require("socket.io");



const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
        transports: ['polling', 'websocket']
    }
});


io.on("connection", (socket) => {
    console.log("User Connected. Id :- ", socket.id);

    io.on("disconnect", () => {
        console.log("User disconnected. Id:- ", socket.id);
    })
})


// module.exports = { app, server }