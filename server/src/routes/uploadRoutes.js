const express = require("express");
const { uploadListFile } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadListFile);

module.exports = router;
