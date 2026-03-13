const {Router} = require("express");
const songController = require("../controllers/song.controller.js");
const upload = require("../configs/song.upload.js");
const identifyUser = require("../middlewares/identifyUser.js");

const songRouter = Router();

/**
 * @route POST /api/songs/
 * @description Upload the song file
 */
songRouter.post("/", upload.single("song"), songController.uploadSong);

/**
 * @route GET /api/songs/
 * @description Get song by mood
 */ 
songRouter.get("/", identifyUser, songController.getSong);

module.exports = songRouter;