const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



async function checkPassword(req, res) {
    try {
        // console.log("in backend received data>>", req.body);

        const { password, userId } = req.body;

        const user = await User.findById(userId);

        const passwordMatched = await bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            return res.status(400).json({
                message: "Please check password",
                error: true
            })
        }

        // const tokenData = {
        //     id: user._id,
        //     email: user.email
        // }

        // this token is sent to frontend and stored in cookie
        const accessToken = await jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_SEC_KEY, { expiresIn: "1d" });

        const tokenOption = {
            httpOnly: true,
            secure: true
        }

        return res.status(200).cookie("token", accessToken, tokenOption).json({
            message: "User login successfully",
            error: false,
            token: accessToken
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}


module.exports = checkPassword;