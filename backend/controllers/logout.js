async function logout(req, res) {
    try {
        res.clearCookie("token");

        return res.status(200).json({
            message: "Logout successfully ...",
            error: false
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message || err,
            error: true
        })
    }
}

module.exports = logout;