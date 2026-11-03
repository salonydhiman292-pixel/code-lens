import express from "express";
import { getCodeAnalysis, runCodeAnalysis } from "../controllers/analysisController.js";

const router = express.Router();

router.get("/", getCodeAnalysis);
router.post("/run", runCodeAnalysis);

export default router;
