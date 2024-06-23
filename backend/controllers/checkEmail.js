const User = require("../models/User");


async function checkEmail(req, res) {
    try {
        const { email } = req.body;

        const checkEmail = await User.findOne({ email }).select("-password");

        if (!checkEmail) {
            return res.status(400).json({
                message: "User does not exist ...",
                error: true
            })
        }

        // const { password, ...payload } = checkEmail;
        return res.status(200).json({
            message: "Email verified ...",
            error: false,
            data: checkEmail
        });

    } catch (err) {
        return res.status(500).json({
            mesage: err.mesage || err,
            error: true
        });
    }
}

module.exports = checkEmail;