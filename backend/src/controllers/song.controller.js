const songModel = require("../models/song.model.js");
const id3 = require("node-id3");
const storageService = require("../services/storage.service.js");

async function uploadSong(req, res) {
    const songBuffer = req.file.buffer;
    const mood = req.body;

    // Buffer has data such as audio buffer and metadata of song file
    const tags = id3.read(songBuffer);
    
    // Simultaneous upload of song audio and song poster happening
    const [songFile, posterFile] = await Promise.all(
        [
            storageService.uploadFile({
                buffer: songBuffer,
                filename: tags.title + ".mp3",
                folder: "/moodify/songs"
            }),
            storageService.uploadFile({
                buffer: tags.image.imageBuffer,
                filename: tags.title + ".jpeg",
                folder: "/moodify/posters"
            })
        ]
    );
    
    // Storing file's metadata in MongoDB
    const song = await songModel.create({
        URL: songFile.url,
        posterURL: posterFile.url,
        title: tags.title,
        mood
    });

    res.status(200).json({
        success: true,
        message: "Song uploaded",
        song
    });
}

module.exports = {
    uploadSong
}