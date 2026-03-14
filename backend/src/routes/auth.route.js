const { Router } = require("express");
const authController = require("../controllers/auth.controller.js");
const identifyUser = require("../middlewares/identifyUser.js");

const authRouter = Router();

/**
 * @route POST /api/auth/register
 */
authRouter.post("/register", authController.registerUser);

/**
 * @route POST /api/auth/login
 */
authRouter.post("/login", authController.loginUser);

/**
 * @route POST /api/auth/logout
 */
authRouter.post("/logout", identifyUser, authController.logoutUser);

/**
 * @route POST /api/auth/getMe
 */
authRouter.get("/getMe", identifyUser, authController.getMe);

module.exports = authRouter;