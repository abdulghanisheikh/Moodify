const { Router } = require("express");
const authController = require("../controllers/auth.controller.js");

const authRouter = Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);
authRouter.post("/logout", authController.logoutUser); // Yet to implement

module.exports = authRouter;