const User = require("../models/User");

async function searchUser(req, res) {
    try {
        const { search } = req.body;

        const query = new RegExp(search, "i", "g");

        const user = await User.find({
            "$or": [
                { name: query },
                { email: query }
            ]
        }).select("-password");

        return res.status(200).json({
            messsage: "all users",
            data: user,
            error: false
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}

module.exports = searchUser;