import express from "express";
import { register, login, getMe, githubLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/github", githubLogin);
router.get("/me", getMe);

export default router;

