const userModel = require("../models/user.model.js");

async function getMe(req, res) {
    const user = await userModel.findOne({ _id: req.user.id });

    if(!user) {
        return res.status(400).json({
            success: false,
            message: "User not found.",
            user: null
        });
    }

    return res.status(200).json({
        success: true,
        message: "User fetched",
        user
    });
}

module.exports = {
    getMe
};