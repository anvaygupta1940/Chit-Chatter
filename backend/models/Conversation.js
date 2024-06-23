const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    sender: {
        // store the user id
        type: mongoose.Schema.ObjectId,
        require: true,
        // populate it ,to get the user information
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: "User"
    },
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Message"
        }
    ]
}, {
    timestamps: true
});

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;