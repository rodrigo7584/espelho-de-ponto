const express = require("express");
const router = express.Router();
const controller = require("../controllers/colaboradorController");

router.get("/", controller.listar);
// router.get("/:id", controller.buscarPorId);
// router.get("/:empresa", controller.buscarPorEmpresa);
router.post("/", controller.criar);
// router.put("/:id", controller.atualizar);
// router.delete("/:id", controller.excluir);

module.exports = router;
