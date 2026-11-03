import express from "express";
import { getRiskPrediction, runRiskAnalysis } from "../controllers/riskController.js";

const router = express.Router();

router.get("/", getRiskPrediction);
router.post("/run", runRiskAnalysis);

export default router;
