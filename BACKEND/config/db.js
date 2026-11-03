import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/code_lens";
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Connection notice: ${error.message}. Running with high-resilience in-memory state fallback.`);
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState,
});
