import mongoose from "mongoose";

const riskFactorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
  impact: { type: String, default: "" },
  shapValue: { type: Number, default: 0 },
  description: { type: String, default: "" },
  color: { type: String, default: "#ef4444" },
});

const riskPredictionSchema = new mongoose.Schema(
  {
    repository: { type: String, default: "code-lens-frontend" },
    overallRisk: { type: Number, default: 68 },
    status: { type: String, default: "Needs Attention" },
    highRiskFiles: { type: Number, default: 12 },
    predictedBugs: { type: Number, default: 27 },
    aiConfidence: { type: Number, default: 91 },
    aiInsightTitle: {
      type: String,
      default: "Authentication code needs immediate review",
    },
    aiInsightDescription: {
      type: String,
      default:
        "The AI model detected a high probability of future defects based on code complexity, recent modifications and historical patterns.",
    },
    riskDistribution: {
      high: { type: Number, default: 18 },
      medium: { type: Number, default: 34 },
      low: { type: Number, default: 48 },
    },
    factors: [riskFactorSchema],
  },
  { timestamps: true }
);

export default mongoose.models.RiskPrediction || mongoose.model("RiskPrediction", riskPredictionSchema);
