const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model.js");

async function identifyUser(req, res, next) {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            success: true,
            message: "No token found, Unauthorized access."
        });
    }

    // Check for blacklist token
    const isTokenBlacklisted = await blacklistModel.findOne({ token });

    if(isTokenBlacklisted) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }

    let decoded = null;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(err) {
        console.log(err.message);
    }

    req.user = decoded;
    next();
}

module.exports = {
    identifyUser
}