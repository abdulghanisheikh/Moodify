const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

async function uploadFile({ buffer, filename, folder = "" }) {
    const result = await imagekit.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName: filename,
        folder
    });

    return result;
}

module.exports = {
    uploadFile
}