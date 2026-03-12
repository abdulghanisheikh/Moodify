const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    URL: {
        type: String,
        required: true
    },
    posterURL: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

const songModel = mongoose.model("songs", songSchema);
module.exports = songModel;