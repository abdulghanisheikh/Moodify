require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route.js");

const app = express();
app.use(express.json);
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
    res.send("hello");
});

module.exports = app;