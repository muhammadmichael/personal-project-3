// Source: https://www.bezkoder.com/node-js-upload-image-mysql/

// const multer = require("multer");

// const imageFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb("Please upload only images.", false);
//   }
// };

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/images/uploadedimages/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// var upload = multer({ storage: storage, fileFilter: imageFilter });

const { GraphQLUpload }= require('graphql-upload')
module.exports = GraphQLUpload;