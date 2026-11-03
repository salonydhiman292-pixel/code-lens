import express from "express";
import { getSecurityScan, runSecurityScan } from "../controllers/securityController.js";

const router = express.Router();

router.get("/", getSecurityScan);
router.post("/scan", runSecurityScan);

export default router;
