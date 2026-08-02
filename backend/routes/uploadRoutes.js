const express = require("express");
const multer = require("multer");
const { uploadDocument } = require("../controllers/uploadController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("document"), uploadDocument);

module.exports = router;