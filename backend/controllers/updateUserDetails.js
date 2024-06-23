const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const User = require("../models/User");

async function updateUserDetails(req, res) {
    try {
        const token = req.cookies.token || ""


        const user = await getUserDetailsFromToken(token);

        // fields to update
        const { name, profile_pic } = req.body;

        const updateUser = await User.updateOne({ _id: user._id }, {
            name,
            profile_pic
        });


        const updatedUserInfo = await User.findById(user._id);
        // console.log("updated user info >>", updatedUserInfo);

        return res.status(201).json({
            message: "User info updated successfully ...",
            error: false,
            data: updatedUserInfo
        });

    } catch (err) {
        return res.status(400).json({
            message: err.message || err,
            error: true
        })
    }
}


module.exports = updateUserDetails;