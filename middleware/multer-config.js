const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

// Image config
const imageMsgFileStorage = multer.diskStorage({
  destination: `uploads/${process.env.IMAGE_PATH}`,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadImage = multer({
  storage: imageMsgFileStorage,
  limits: { fileSize: 1000000 },
}).single("imageMsg");

// Audio config
const audioMsgFileStorage = multer.diskStorage({
  destination: `uploads/${process.env.AUDIO_PATH}`,
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".webm");
  },
});

const uploadAudio = multer({
  storage: audioMsgFileStorage,
  limits: { fileSize: 1000000 },
}).single("track");

module.exports = { uploadImage, uploadAudio };
