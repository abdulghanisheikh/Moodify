const { Router } = require("express");
const authController = require("../controllers/auth.controller.js");
const {identifyUser} = require("../middlewares/identifyUser.js");

const authRouter = Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);
authRouter.post("/logout", identifyUser, authController.logoutUser);

module.exports = authRouter;