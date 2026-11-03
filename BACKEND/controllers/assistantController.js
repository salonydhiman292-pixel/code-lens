import ChatMessage from "../models/ChatMessage.js";
import { defaultSeedData } from "../data/seedData.js";
import { generateAIChatResponse } from "../services/geminiService.js";

let memoryMessages = [
  {
    role: "ai",
    text: defaultSeedData.aiAssistant.welcomeMessage,
    createdAt: new Date(),
  },
];

export const getAssistantConfig = (req, res) => {
  res.json({
    success: true,
    suggestions: defaultSeedData.aiAssistant.suggestions,
    status: "Online",
    provider: process.env.GEMINI_API_KEY ? "Google Gemini API" : "Code Lens Heuristic Engine",
  });
};

export const getChatHistory = async (req, res) => {
  try {
    let messages = memoryMessages;
    try {
      const dbMessages = await ChatMessage.find().sort({ createdAt: 1 }).lean();
      if (dbMessages && dbMessages.length > 0) {
        messages = dbMessages;
      }
    } catch {
      // fallback
    }

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message, repository = "code-lens-frontend" } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const userEntry = {
      role: "user",
      text: message.trim(),
      repository,
      createdAt: new Date(),
    };

    memoryMessages.push(userEntry);

    try {
      await ChatMessage.create(userEntry);
    } catch {
      // fallback
    }

    // Call Google Gemini API (or Code Lens AI reasoning fallback)
    const aiResponseText = await generateAIChatResponse({
      question: message.trim(),
      context: { repository },
    });

    const aiEntry = {
      role: "ai",
      text: aiResponseText,
      repository,
      createdAt: new Date(),
    };

    memoryMessages.push(aiEntry);

    try {
      await ChatMessage.create(aiEntry);
    } catch {
      // fallback
    }

    res.json({
      success: true,
      userMessage: userEntry,
      aiMessage: aiEntry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    memoryMessages = [
      {
        role: "ai",
        text: defaultSeedData.aiAssistant.welcomeMessage,
        createdAt: new Date(),
      },
    ];

    try {
      await ChatMessage.deleteMany({});
      await ChatMessage.create(memoryMessages[0]);
    } catch {
      // fallback
    }

    res.json({ success: true, message: "Chat history cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
