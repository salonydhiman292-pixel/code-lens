import express from "express";
import {
  getRepositories,
  connectRepository,
  analyzeRepository,
  deleteRepository,
} from "../controllers/repositoryController.js";

const router = express.Router();

router.get("/", getRepositories);
router.post("/", connectRepository);
router.post("/:name/analyze", analyzeRepository);
router.delete("/:id", deleteRepository);

export default router;
