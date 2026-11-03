import mongoose from "mongoose";
import dotenv from "dotenv";
import { defaultSeedData } from "./seedData.js";
import User from "../models/User.js";
import Repository from "../models/Repository.js";
import CodeAnalysis from "../models/CodeAnalysis.js";
import RiskPrediction from "../models/RiskPrediction.js";
import SecurityScan from "../models/SecurityScan.js";
import TechnicalDebt from "../models/TechnicalDebt.js";
import ChatMessage from "../models/ChatMessage.js";

dotenv.config();

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log("[Seeder] Connected to MongoDB Atlas");

    // Clean and seed
    await User.deleteMany({});
    await User.create(defaultSeedData.user);

    await Repository.deleteMany({});
    await Repository.insertMany(defaultSeedData.repositories);

    await CodeAnalysis.deleteMany({});
    await CodeAnalysis.create(defaultSeedData.codeAnalysis);

    await RiskPrediction.deleteMany({});
    await RiskPrediction.create(defaultSeedData.riskPrediction);

    await SecurityScan.deleteMany({});
    await SecurityScan.create(defaultSeedData.securityScan);

    await TechnicalDebt.deleteMany({});
    await TechnicalDebt.create(defaultSeedData.technicalDebt);

    await ChatMessage.deleteMany({});
    await ChatMessage.create({
      role: "ai",
      text: defaultSeedData.aiAssistant.welcomeMessage,
      createdAt: new Date(),
    });

    console.log("[Seeder] All collections seeded successfully in MongoDB Atlas!");
    process.exit(0);
  } catch (err) {
    console.error("[Seeder Error]", err);
    process.exit(1);
  }
};

seedDB();
