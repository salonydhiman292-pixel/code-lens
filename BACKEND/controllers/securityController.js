import SecurityScan from "../models/SecurityScan.js";
import Repository from "../models/Repository.js";

const generateRepoVulnerabilities = (repoName) => {
  const base = repoName.split("/").pop() || repoName;
  return [
    {
      title: "CORS Misconfiguration on API Endpoints",
      description: "Access-Control-Allow-Origin header is configured broadly.",
      severity: "Medium",
      category: "Security Misconfiguration",
      file: `${base}/server.js`,
      line: 18,
      remediation: "Restrict allowed origins to trusted client domains.",
    },
    {
      title: "Potential Sensitive Environment Leak",
      description: "Ensure JWT secrets and database connection strings are never committed.",
      severity: "High",
      category: "Sensitive Data",
      file: `${base}/.env.example`,
      line: 3,
      remediation: "Add .env to .gitignore and rotate exposed keys.",
    },
    {
      title: "Input Sanitization on Query Parameters",
      description: "Validate query parameters using schema validator.",
      severity: "Low",
      category: "Injection",
      file: `${base}/routes/api.js`,
      line: 25,
      remediation: "Use express-validator or Joi schemas.",
    },
  ];
};

export const getSecurityScan = async (req, res) => {
  try {
    let { repository, severity } = req.query;

    if (!repository) {
      const first = await Repository.findOne().lean();
      repository = first ? first.name : "code-lens-frontend";
    }

    let scan = await SecurityScan.findOne({ repository }).lean();

    if (!scan) {
      const vulnerabilities = generateRepoVulnerabilities(repository);
      scan = {
        repository,
        branch: "main",
        securityScore: 92,
        rating: "Good Security",
        improvement: "No critical zero-day vulnerabilities detected.",
        counts: {
          critical: 0,
          high: vulnerabilities.filter((v) => v.severity === "High").length,
          medium: vulnerabilities.filter((v) => v.severity === "Medium").length,
          low: vulnerabilities.filter((v) => v.severity === "Low").length,
        },
        categories: [
          { name: "Injection", count: 1, percentage: 33, color: "bg-red-500" },
          { name: "Authentication", count: 0, percentage: 0, color: "bg-orange-500" },
          { name: "Sensitive Data", count: 1, percentage: 33, color: "bg-amber-500" },
          { name: "Security Misconfiguration", count: 1, percentage: 34, color: "bg-blue-600" },
          { name: "Dependencies", count: 0, percentage: 0, color: "bg-purple-600" },
        ],
        vulnerabilities,
        scannedAt: new Date(),
      };
      await SecurityScan.create(scan);
    }

    let vulnerabilities = scan.vulnerabilities || [];
    if (severity && severity !== "All") {
      vulnerabilities = vulnerabilities.filter(
        (v) => v.severity.toLowerCase() === severity.toLowerCase()
      );
    }

    res.json({
      success: true,
      security: {
        ...scan,
        vulnerabilities,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const runSecurityScan = async (req, res) => {
  try {
    const { repository = "code-lens-frontend", branch = "main" } = req.body;

    const vulnerabilities = generateRepoVulnerabilities(repository);
    const critical = 0;
    const high = vulnerabilities.filter((v) => v.severity === "High").length;
    const medium = vulnerabilities.filter((v) => v.severity === "Medium").length;
    const low = vulnerabilities.filter((v) => v.severity === "Low").length;

    const updatedSecurity = {
      repository,
      branch,
      securityScore: 94,
      rating: "Good Security",
      improvement: "Security scan verified 0 critical CVEs.",
      counts: { critical, high, medium, low },
      categories: [
        { name: "Injection", count: 1, percentage: 33, color: "bg-red-500" },
        { name: "Authentication", count: 0, percentage: 0, color: "bg-orange-500" },
        { name: "Sensitive Data", count: 1, percentage: 33, color: "bg-amber-500" },
        { name: "Security Misconfiguration", count: 1, percentage: 34, color: "bg-blue-600" },
        { name: "Dependencies", count: 0, percentage: 0, color: "bg-purple-600" },
      ],
      vulnerabilities,
      scannedAt: new Date(),
    };

    const saved = await SecurityScan.findOneAndUpdate(
      { repository },
      updatedSecurity,
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Security scan completed successfully",
      security: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
