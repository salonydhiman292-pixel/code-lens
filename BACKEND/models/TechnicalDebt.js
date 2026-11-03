import mongoose from "mongoose";

const technicalDebtSchema = new mongoose.Schema(
  {
    repository: { type: String, default: "all" },
    debtScore: { type: Number, default: 34 },
    status: { type: String, default: "Moderate Technical Debt" },
    trendLabel: { type: String, default: "Debt increased by 2.4% this month" },
    estimatedEffort: { type: String, default: "18h" },
    codeSmells: { type: Number, default: 47 },
    highPrioritySmells: { type: Number, default: 9 },
    duplicatedCode: { type: Number, default: 8.4 },
    categories: [
      {
        name: { type: String, required: true },
        score: { type: Number, required: true },
        color: { type: String, default: "#ef4444" },
      },
    ],
    trend: [
      {
        month: { type: String, required: true },
        hours: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.TechnicalDebt || mongoose.model("TechnicalDebt", technicalDebtSchema);
