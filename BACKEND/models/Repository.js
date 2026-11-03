import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    language: { type: String, required: true },
    branch: { type: String, default: "main" },
    health: { type: Number, default: 85 },
    issues: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Connected", "Needs Attention", "Disconnected"],
      default: "Connected",
    },
    updated: { type: String, default: "Just now" },
    repoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Repository || mongoose.model("Repository", repositorySchema);
