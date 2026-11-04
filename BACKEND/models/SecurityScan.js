import mongoose from "mongoose";

const vulnerabilitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  severity: { type: String, enum: ["Critical", "High", "Medium", "Low"], required: true },
  category: { type: String, required: true },
  cwe: { type: String, default: "" },
  file: { type: String, required: true },
  line: { type: Number, default: 1 },
  codeSnippet: { type: String, default: "" },
  remediation: { type: String, default: "" },
});

const securityScanSchema = new mongoose.Schema(
  {
    repository: { type: String, default: "code-lens-frontend" },
    branch: { type: String, default: "main" },
    securityScore: { type: Number, default: 88 },
    rating: { type: String, default: "Good Security" },
    improvement: { type: String, default: "+6.2% this month" },
    counts: {
      critical: { type: Number, default: 2 },
      high: { type: Number, default: 5 },
      medium: { type: Number, default: 8 },
      low: { type: Number, default: 12 },
    },
    categories: [
      {
        name: { type: String, required: true },
        count: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
        color: { type: String, default: "#ef4444" },
      },
    ],
    vulnerabilities: [vulnerabilitySchema],
    scannedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.SecurityScan || mongoose.model("SecurityScan", securityScanSchema);
