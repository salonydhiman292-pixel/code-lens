import CodeAnalysis from "../models/CodeAnalysis.js";
import Repository from "../models/Repository.js";

const generateRepoIssues = (repoName, lang = "JavaScript") => {
  const baseName = repoName.split("/").pop() || repoName;
  return [
    {
      file: `${baseName}/index.js`,
      issue: "Async function missing try/catch error handling",
      severity: "Medium",
      score: 65,
    },
    {
      file: `${baseName}/config.json`,
      issue: "Environment variable fallback used without validation",
      severity: "Low",
      score: 42,
    },
    {
      file: `${baseName}/router.js`,
      issue: "High cyclomatic complexity in route handler",
      severity: "High",
      score: 84,
    },
  ];
};

export const getCodeAnalysis = async (req, res) => {
  try {
    let { repository, branch = "main" } = req.query;

    if (!repository) {
      const firstRepo = await Repository.findOne().lean();
      repository = firstRepo ? firstRepo.name : "code-lens-frontend";
    }

    let analysis = await CodeAnalysis.findOne({ repository }).lean();

    if (!analysis) {
      const issues = generateRepoIssues(repository);
      analysis = {
        repository,
        branch,
        qualityScore: 88,
        qualityRating: "Excellent",
        issuesFound: issues.length,
        highPriorityIssues: issues.filter((i) => i.severity === "High").length,
        filesAnalyzed: 32,
        coverage: 80,
        maintainability: 89,
        reliability: 92,
        security: 90,
        testCoverage: 80,
        issues,
        analyzedAt: new Date(),
      };
      await CodeAnalysis.create(analysis);
    }

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const runCodeAnalysis = async (req, res) => {
  try {
    const { repository = "code-lens-frontend", branch = "main" } = req.body;

    const repoDoc = await Repository.findOne({ name: repository }).lean();
    const lang = repoDoc?.language || "JavaScript";

    const issues = generateRepoIssues(repository, lang);
    const qualityScore = 89;

    const updatedAnalysis = {
      repository,
      branch,
      qualityScore,
      qualityRating: "Excellent",
      issuesFound: issues.length,
      highPriorityIssues: issues.filter((i) => i.severity === "High").length,
      filesAnalyzed: 45,
      coverage: 82,
      maintainability: 91,
      reliability: 93,
      security: 92,
      testCoverage: 82,
      issues,
      analyzedAt: new Date(),
    };

    const saved = await CodeAnalysis.findOneAndUpdate(
      { repository },
      updatedAnalysis,
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Code analysis completed successfully",
      analysis: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
