// Source: https://github.com/siamahnaf198/graphql-upload

const {parse, join} = require("path"); // This is node built in package
const {createWriteStream} = require("fs"); // this is node built in package
const fs = require("fs"); // this is node built in package
const path = require('path')

module.exports.upload= async (file) => {
    const {createReadStream, filename} = await file;
    const stream = createReadStream();
    var {ext, name} = parse(filename);

    // Membuat url untuk disimpan ke DB dan path ke folder uploaded images
    let url = join(__dirname, `../public/images/uploadedimages/${name}${ext}`);

    // Menyimpan file dari pengguna
    const imageStream = await createWriteStream(url)
    await stream.pipe(imageStream);
    
    return url;
}