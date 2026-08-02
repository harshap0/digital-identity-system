const express = require("express");
const router = express.Router();

const {
  getDocuments,
  deleteDocument,
  updateDocument,
} = require("../controllers/documentController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getDocuments);
router.delete("/:id", deleteDocument);
router.put("/:id", updateDocument);

module.exports = router;