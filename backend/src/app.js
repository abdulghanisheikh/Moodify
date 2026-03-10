const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route.js");
const userRouter = require("./routes/user.route.js");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
    res.send("hello");
});

module.exports = app;