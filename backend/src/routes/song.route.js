const {Router} = require("express");
const songController = require("../controllers/song.controller.js");
const upload = require("../configs/song.upload.js");

const songRouter = Router();

/**
 * @route POST /api/songs/upload
 * @description Upload the song file
 */
songRouter.post("/upload", upload.single("song"), songController.uploadSong);

module.exports = songRouter;