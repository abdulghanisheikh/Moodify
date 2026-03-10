const userController = require("../controllers/user.controller.js");
const {Router} = require("express");
const authMiddleware = require("../middlewares/identifyUser.js");

const userRouter = Router();

userRouter.get("/getMe", authMiddleware.identifyUser, userController.getMe);

module.exports = userRouter;