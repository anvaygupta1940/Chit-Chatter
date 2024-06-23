const jwt = require("jsonwebtoken");
const User = require("../models/User");

// get user details from token and find the user in database
const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return {
            message: "session out",
            logout: true
        }
    }

    const decode = await jwt.verify(token, process.env.JWT_SEC_KEY);

    const user = await User.findById(decode.id).select('-password');

    return user
}

module.exports = getUserDetailsFromToken;