import { Router } from "express";
import { listarGrupos, criarGrupo } from "../controllers/grupoController";

const router = Router();

// GET /grupos — lista todos os grupos.
router.get("/grupos", listarGrupos);

// POST /grupos — cria um novo grupo.
router.post("/grupos", criarGrupo);

export default router;
