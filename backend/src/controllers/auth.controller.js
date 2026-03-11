const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redis = require("../configs/cache.js");

async function registerUser(req, res) {
    const {username, email, password} = req.body;

    const existingUser = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if(existingUser) {
        return res.status(400).json({
            success: true,
            message: "User with same username or email already exists."
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    });

    // Make JWT token and save it into cookies
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    });
    res.cookie("token", token);

    return res.status(200).json({
        success: true,
        message: "User registered",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

async function loginUser(req, res) {
    const {username, email, password} = req.body;

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    }).select("+password"); // Force read password

    if(!user) {
        return res.status(400).json({
            success: true,
            message: "Invalid credentials"
        });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if(!isPasswordMatch) {
        return res.status(400).json({
            success: true,
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    });

    res.cookie("token", token);

    res.status(200).json({
        success: true,
        message: "User logged in",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

async function logoutUser(req, res) {
    const token = req.cookies.token;

    res.clearCookie("token");

    // Blacklisting token in redis
    await redis.set(token, Date.now().toString(), "EX", 60*60);

    res.status(200).json({
        success: true,
        message: "User logged out"
    });
}

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
    registerUser,
    loginUser,
    logoutUser,
    getMe
}