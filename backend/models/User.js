const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Provide name"]
    },
    email: {
        type: String,
        require: [true, "Provide email"],
        unique: true
    },
    password: {
        type: String,
        require: [true, "Provide password"]
    },
    profile_pic: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;