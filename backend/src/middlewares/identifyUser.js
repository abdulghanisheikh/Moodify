const jwt = require("jsonwebtoken");
const redis = require("../configs/cache.js");

async function identifyUser(req, res, next) {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            success: true,
            message: "No token found, Unauthorized access."
        });
    }
    
    // Checking for blacklisted token from redis
    let isTokenBlacklisted;
    try {
        isTokenBlacklisted = await redis.get(token);
    } catch(err) {
        console.log(err.message);
    }

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