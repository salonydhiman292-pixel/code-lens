import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  file: { type: String, required: true },
  issue: { type: String, required: true },
  severity: { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Medium" },
  score: { type: Number, default: 50 },
});

const codeAnalysisSchema = new mongoose.Schema(
  {
    repository: { type: String, required: true },
    branch: { type: String, default: "main" },
    qualityScore: { type: Number, default: 86 },
    issuesFound: { type: Number, default: 34 },
    highPriorityIssues: { type: Number, default: 8 },
    filesAnalyzed: { type: Number, default: 248 },
    coverage: { type: Number, default: 76 },
    maintainability: { type: Number, default: 84 },
    reliability: { type: Number, default: 91 },
    security: { type: Number, default: 88 },
    testCoverage: { type: Number, default: 76 },
    issues: [issueSchema],
    analyzedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.CodeAnalysis || mongoose.model("CodeAnalysis", codeAnalysisSchema);
