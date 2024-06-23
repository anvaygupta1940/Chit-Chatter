const express = require("express");
const registerUser = require("../controllers/registerUser");
const checkEmail = require("../controllers/checkEmail");
const checkPassword = require("../controllers/checkPassword");
const userDetails = require("../controllers/userDetails");
const logout = require("../controllers/logout");
const updateUserDetails = require("../controllers/updateUserDetails");
const searchUser = require("../controllers/searchUser");



const router = express.Router();


// create new user api
router.post("/register", registerUser);
// check email exist or not while login
router.post("/email", checkEmail);
// check password while login
router.post("/password", checkPassword);
// fetching user details from the stored token as cookie
router.get("/user-details", userDetails);
// logout 
router.get("/logout", logout);
// update user details
router.post("/update-user", updateUserDetails);
// search user
router.post("/search-user", searchUser);



module.exports = router