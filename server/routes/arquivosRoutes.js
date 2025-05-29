const express = require("express");
const multer = require("multer");
const { handleUpload } = require("../controllers/arquivosController");

const router = express.Router();
const upload = multer({ dest: "arquivos/" });

router.post("/", upload.single("pdf"), handleUpload);

module.exports = router;
