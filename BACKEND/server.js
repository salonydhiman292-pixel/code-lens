import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { connectDB, getDBStatus } from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import riskRoutes from "./routes/riskRoutes.js";
import securityRoutes from "./routes/securityRoutes.js";
import debtRoutes from "./routes/debtRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/technical-debt", debtRoutes);
app.use("/api/assistant", assistantRoutes);

// Direct PDF Download Endpoint
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handlePdfDownload = (req, res) => {
  const localBackendPdf = path.join(__dirname, "Code_Lens_Backend_Documentation.pdf");
  const rootPdf = path.resolve(__dirname, "../Code_Lens_Backend_Documentation.pdf");

  let pdfPath = null;
  if (fs.existsSync(localBackendPdf)) {
    pdfPath = localBackendPdf;
  } else if (fs.existsSync(rootPdf)) {
    pdfPath = rootPdf;
  }

  if (pdfPath) {
    res.download(pdfPath, "Code_Lens_Backend_Documentation.pdf");
  } else {
    res.status(404).json({ success: false, message: "Documentation PDF not found" });
  }
};

app.get("/download-pdf", handlePdfDownload);
app.get("/api/download-pdf", handlePdfDownload);

// Root & Health Checks
app.get("/", (req, res) => {
  res.json({
    project: "Code Lens",
    subtitle: "AI-Powered Software Change Intelligence Platform",
    status: "Active",
    mongodb: getDBStatus(),
    googleApiAvailable: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    documentation: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "Healthy",
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
    endpoints: [
      "/api/auth",
      "/api/dashboard/summary",
      "/api/repositories",
      "/api/analysis",
      "/api/risk",
      "/api/security",
      "/api/technical-debt",
      "/api/assistant",
    ],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Code Lens Backend running on http://localhost:${PORT}`);
    console.log(`📡 Connected to Google Gemini API: ${process.env.GEMINI_API_KEY ? "Yes" : "Fallback heuristic active"}`);
    console.log(`📊 AI Software Change Intelligence Platform Ready`);
    console.log(`====================================================`);
  });
};

startServer();
