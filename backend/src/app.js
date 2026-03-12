const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route.js");
const songRouter = require("./routes/song.route.js");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);

app.get("*name", (req, res) => {
    res.send("You are at wild card route.");
});

module.exports = app;