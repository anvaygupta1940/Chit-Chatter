const User = require("../models/User");
const bcrypt = require("bcryptjs");


async function registerUser(req, res) {
    try {
        const { name, password, email, profile_pic } = req.body;

        // if email already exist
        const hasEmail = await User.findOne({ email });

        if (hasEmail) {
            return res.status(400).json({
                message: "Email already exist",
                error: true
            })
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const payload = {
            name,
            email,
            password: hashedPassword,
            profile_pic
        }

        const newUser = new User(payload);
        const savedUser = await newUser.save();

        return res.status(201).json({
            message: "User register successfully ...",
            error: false,
            data: savedUser
        });


    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}

module.exports = registerUser;