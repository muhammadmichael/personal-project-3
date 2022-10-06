// Source: https://github.com/siamahnaf198/graphql-upload

module.exports.upload= async (file) => {
    const {createReadStream, filename} = await file;
    const stream = createReadStream();
    var {ext, name} = parse(filename);
    name = `single${Math.floor((Math.random() * 10000) + 1)}`;
    let url = join(__dirname, `../Upload/${name}-${Date.now()}${ext}`);
    const imageStream = await createWriteStream(url)
    await stream.pipe(imageStream);
    const baseUrl = process.env.BASE_URL
    const port = process.env.PORT
    url = `${baseUrl}${port}${url.split('Upload')[1]}`;
    return url;
}