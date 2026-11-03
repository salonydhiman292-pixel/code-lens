import Repository from "../models/Repository.js";

const parseRepoInput = (rawName, rawUrl) => {
  let cleaned = (rawName || "").trim();
  let url = (rawUrl || "").trim();

  // If input is a full git/github URL
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://") || cleaned.includes("github.com/")) {
    url = cleaned;
    // Extract owner/repo
    const parts = cleaned.replace(/\.git$/, "").split("github.com/")[1];
    if (parts) {
      cleaned = parts.split("/").slice(0, 2).join("/");
    }
  } else if (!url && cleaned.includes("/")) {
    url = `https://github.com/${cleaned}`;
  }

  return { name: cleaned, repoUrl: url };
};

export const getRepositories = async (req, res) => {
  try {
    const repos = await Repository.find().sort({ updatedAt: -1 }).lean();

    const totalRepositories = repos.length;
    const healthy = repos.filter((r) => r.health >= 80).length;
    const needsAttention = repos.filter((r) => r.health < 80).length;
    const totalIssues = repos.reduce((sum, r) => sum + (r.issues || 0), 0);

    res.json({
      success: true,
      summary: {
        totalRepositories,
        healthy,
        needsAttention,
        totalIssues,
      },
      repositories: repos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const connectRepository = async (req, res) => {
  try {
    const { name: rawName, description, language, branch, repoUrl: rawUrl } = req.body;
    if (!rawName) {
      return res.status(400).json({ success: false, message: "Repository name is required" });
    }

    const { name, repoUrl } = parseRepoInput(rawName, rawUrl);

    // Check if repo already exists
    const existing = await Repository.findOne({ name });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Repository already connected",
        repository: existing,
      });
    }

    const newRepo = {
      name,
      description: description || "Connected GitHub Repository",
      language: language || "JavaScript",
      branch: branch || "main",
      health: 85,
      issues: 3,
      status: "Connected",
      updated: "Just now",
      repoUrl: repoUrl || `https://github.com/${name}`,
    };

    const created = await Repository.create(newRepo);
    return res.status(201).json({ success: true, repository: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const analyzeRepository = async (req, res) => {
  try {
    const { name } = req.params;
    const repo = await Repository.findOne({
      $or: [{ name }, { name: decodeURIComponent(name) }],
    });

    if (!repo) {
      return res.status(404).json({ success: false, message: "Repository not found" });
    }

    repo.updated = "Just now";
    await repo.save();

    res.json({
      success: true,
      repository: repo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRepository = async (req, res) => {
  try {
    const { id } = req.params;
    await Repository.deleteOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { name: id },
        { name: decodeURIComponent(id) },
      ],
    });
    res.json({ success: true, message: "Repository deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
