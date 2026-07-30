const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { uploadDocument } = require("./controllers/uploadController");

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("IdentityHub Backend is Running 🚀");
});

app.post("/upload", upload.single("document"), uploadDocument);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});