import express from "express";
import {
  getAssistantConfig,
  getChatHistory,
  sendMessage,
  clearHistory,
} from "../controllers/assistantController.js";

const router = express.Router();

router.get("/config", getAssistantConfig);
router.get("/history", getChatHistory);
router.post("/chat", sendMessage);
router.delete("/history", clearHistory);

export default router;
