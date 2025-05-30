const express = require("express");
const multer = require("multer");
const { handleUploadDual } = require("../controllers/uploadDualController");

const router = express.Router();

const upload = multer({ dest: "arquivos/" });

router.post(
	"/dual",
	upload.fields([
		{ name: "pdfColaboradores", maxCount: 1 },
		{ name: "pdfTarget", maxCount: 1 },
	]),
	handleUploadDual,
);

module.exports = router;
