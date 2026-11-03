import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "ai", "system"], required: true },
    text: { type: String, required: true },
    repository: { type: String, default: "code-lens-frontend" },
  },
  { timestamps: true }
);

export default mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);
