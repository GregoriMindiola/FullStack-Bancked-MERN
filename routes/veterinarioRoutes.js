import express from "express";
import {
  auth,
  confirmar,
  perfil,
  registrar,
  olvidePassword,
  comprobarToken,
  nuevoPassword
} from "../controllers/veterinario.controller.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//area publica
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", auth);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)

//area privada
router.get("/perfil", checkAuth, perfil);

export default router;
