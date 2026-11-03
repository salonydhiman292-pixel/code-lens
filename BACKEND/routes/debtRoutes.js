import express from "express";
import { getTechnicalDebt, scanTechnicalDebt } from "../controllers/debtController.js";

const router = express.Router();

router.get("/", getTechnicalDebt);
router.post("/scan", scanTechnicalDebt);

export default router;
