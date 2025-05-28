const express = require("express");
const router = express.Router();
const controller = require("../controllers/colaboradorController");

router.get("/colaborador/:id", controller.buscarPorColaborador);
router.get("/empresa/:id", controller.buscarPorEmpresa);
router.get("/empresas/", controller.buscarEmpresas);

router.get("/", controller.listar);
router.post("/", controller.criar);
router.put("/colaborador/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

module.exports = router;
