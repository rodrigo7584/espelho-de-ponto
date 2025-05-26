const express = require("express");
const multer = require("multer");
const { handleUpload } = require("../controllers/uploadController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("pdf"), handleUpload);

module.exports = router;
