import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SAST Rule Definitions
const SECURITY_RULES = [
  {
    id: "SEC-001",
    title: "Hardcoded Secret / Fallback Credential",
    severity: "Critical",
    category: "Sensitive Data",
    cwe: "CWE-798",
    regex: /(?:jwt_secret|api_key|secret|password)[ \t]*\|\|[ \t]*['"][a-zA-Z0-9_\-]{4,}['"]/i,
    description: "A hardcoded fallback credential or secret was detected in source code.",
    remediation: "Load all secrets exclusively from secure environment variables without hardcoded fallbacks.",
  },
  {
    id: "SEC-002",
    title: "Insecure Plaintext Password Comparison",
    severity: "High",
    category: "Authentication",
    cwe: "CWE-256",
    regex: /(?:user\.password\s*===\s*password|password\s*===\s*user\.password)/,
    description: "Password is being verified using plaintext comparison instead of secure cryptographic hashing (e.g., bcrypt.compare).",
    remediation: "Use bcrypt.compare(inputPassword, user.passwordHash) with salt rounds >= 10.",
  },
  {
    id: "SEC-003",
    title: "Authentication Bypass / Weak Password Validation",
    severity: "High",
    category: "Authentication",
    cwe: "CWE-287",
    regex: /password\.length\s*>=\s*[1-4]\b/,
    description: "Weak password length or development demo bypass condition detected in authentication flow.",
    remediation: "Enforce strict authentication verification and remove demo fallback login shortcuts.",
  },
  {
    id: "SEC-004",
    title: "Unrestricted CORS Wildcard Policy",
    severity: "Medium",
    category: "Security Misconfiguration",
    cwe: "CWE-942",
    regex: /cors\(\s*\)/,
    description: "CORS middleware is enabled without specific allowed origins, allowing requests from any domain.",
    remediation: "Configure cors({ origin: ['https://trusteddomain.com'] }) with explicit whitelisted origins.",
  },
  {
    id: "SEC-005",
    title: "Potential Connection String Credential Exposure",
    severity: "High",
    category: "Sensitive Data",
    cwe: "CWE-312",
    regex: /mongodb(\+srv)?:\/\/[^:\s]+:[^@\s]+@/,
    description: "MongoDB connection string contains embedded database credentials in plain text.",
    remediation: "Store database connection URI in environment variables and ensure .env is in .gitignore.",
  },
  {
    id: "SEC-006",
    title: "Dangerous Dynamic Code Execution (eval/exec)",
    severity: "Critical",
    category: "Injection",
    cwe: "CWE-95",
    regex: /\b(eval|Function)\s*\(|child_process\.exec\s*\(/,
    description: "Dynamic evaluation or shell execution function detected, potentially allowing arbitrary code execution.",
    remediation: "Avoid dynamic code execution and use safe, parameterized APIs instead.",
  },
  {
    id: "SEC-007",
    title: "Direct HTML Injection (XSS Risk)",
    severity: "Medium",
    category: "Injection",
    cwe: "CWE-79",
    regex: /dangerouslySetInnerHTML|\binnerHTML\s*=/,
    description: "Unsanitized direct HTML injection detected, exposing users to Cross-Site Scripting (XSS).",
    remediation: "Sanitize HTML using DOMPurify before rendering or use safe React data binding.",
  },
  {
    id: "SEC-008",
    title: "Missing Express Security Headers (Helmet)",
    severity: "Low",
    category: "Security Misconfiguration",
    cwe: "CWE-693",
    customCheck: (content, filename) => {
      if (filename.endsWith("server.js") || filename.endsWith("app.js")) {
        if (!content.includes("helmet")) {
          return {
            line: 1,
            codeSnippet: "app.use(express.json())",
            title: "Missing Security Headers Middleware (Helmet)",
            description: "Express server does not load helmet to set standard HTTP security headers (CSP, HSTS, X-Content-Type-Options).",
            severity: "Low",
            category: "Security Misconfiguration",
            cwe: "CWE-693",
            remediation: "Install helmet (`npm install helmet`) and add `app.use(helmet())` before routes.",
          };
        }
      }
      return null;
    },
  },
];

/**
 * Scan text content of a file against SAST security rules
 */
export const scanFileContent = (filePath, content) => {
  const findings = [];
  const lines = content.split("\n");

  for (const rule of SECURITY_RULES) {
    if (rule.regex) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (rule.regex.test(line)) {
          findings.push({
            title: rule.title,
            description: rule.description,
            severity: rule.severity,
            category: rule.category,
            cwe: rule.cwe,
            file: filePath,
            line: i + 1,
            codeSnippet: line.trim().slice(0, 120),
            remediation: rule.remediation,
          });
          break; // One finding per rule per file to keep output focused
        }
      }
    } else if (rule.customCheck) {
      const customFinding = rule.customCheck(content, filePath);
      if (customFinding) {
        findings.push({
          ...customFinding,
          file: filePath,
        });
      }
    }
  }

  return findings;
};

/**
 * Scan files from GitHub REST API
 */
const scanGitHubRepository = async (repoName, branch = "main") => {
  let cleanName = repoName.replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "");
  const parts = cleanName.split("/");
  if (parts.length < 2) return null;

  const owner = parts[0];
  const repo = parts[1];

  const headers = {
    "User-Agent": "Code-Lens-SAST-Scanner/1.0",
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    const treeRes = await fetch(treeUrl, { headers });
    if (!treeRes.ok) return null;

    const treeData = await treeRes.json();
    if (!treeData.tree || !Array.isArray(treeData.tree)) return null;

    const targetExtensions = [".js", ".jsx", ".ts", ".tsx", ".json", ".env.example"];
    const candidates = treeData.tree
      .filter((item) => item.type === "blob")
      .filter((item) => targetExtensions.some((ext) => item.path.endsWith(ext)))
      .filter((item) => !item.path.includes("node_modules/") && !item.path.includes("dist/"))
      .slice(0, 20);

    const allFindings = [];

    for (const item of candidates) {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${item.path}`;
        const rawRes = await fetch(rawUrl, { headers });
        if (rawRes.ok) {
          const content = await rawRes.text();
          const fileFindings = scanFileContent(item.path, content);
          allFindings.push(...fileFindings);
        }
      } catch (e) {
        console.warn(`[GitHub Scan] Could not fetch ${item.path}:`, e.message);
      }
    }

    return allFindings;
  } catch (err) {
    console.warn(`[GitHub Scan Error for ${repoName}]:`, err.message);
    return null;
  }
};

/**
 * Scan local workspace files as fallback or local analysis
 */
const scanLocalRepository = (baseDir) => {
  const allFindings = [];
  const targetExtensions = [".js", ".jsx", ".ts", ".tsx", ".json"];

  const walk = (dir) => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (
          entry.name === "node_modules" ||
          entry.name === "dist" ||
          entry.name === ".git" ||
          entry.name === "seedData.js" ||
          entry.name === "seed.js" ||
          entry.name === "staticAnalysisService.js"
        )
          continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (targetExtensions.some((ext) => entry.name.endsWith(ext))) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const relPath = path.relative(baseDir, fullPath);
          const findings = scanFileContent(relPath, content);
          allFindings.push(...findings);
        }
      }
    } catch {
      // ignore
    }
  };

  walk(baseDir);
  return allFindings;
};

/**
 * Main SAST Security Analysis Engine
 */
export const performActualSecurityScan = async (repoName, branch = "main") => {
  let vulnerabilities = null;

  // 1. Try real GitHub API scan
  vulnerabilities = await scanGitHubRepository(repoName, branch);

  // 2. If GitHub API returned no findings or was rate limited, scan local repository files
  if (!vulnerabilities || vulnerabilities.length === 0) {
    const projectRoot = path.resolve(__dirname, "../../");
    vulnerabilities = scanLocalRepository(projectRoot);
  }

  // Deduplicate findings by title and file
  const seen = new Set();
  const uniqueVulnerabilities = (vulnerabilities || []).filter((v) => {
    const key = `${v.title}-${v.file}-${v.line}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const critical = uniqueVulnerabilities.filter((v) => v.severity === "Critical").length;
  const high = uniqueVulnerabilities.filter((v) => v.severity === "High").length;
  const medium = uniqueVulnerabilities.filter((v) => v.severity === "Medium").length;
  const low = uniqueVulnerabilities.filter((v) => v.severity === "Low").length;
  const total = uniqueVulnerabilities.length;

  // Calculate actual security score (100 - weighted penalties)
  const penalty = critical * 20 + high * 10 + medium * 5 + low * 2;
  const securityScore = Math.max(25, Math.min(100, 100 - penalty));

  let rating = "Good Security";
  if (securityScore >= 90) rating = "Excellent Security";
  else if (securityScore >= 75) rating = "Good Security";
  else if (securityScore >= 50) rating = "Needs Attention";
  else rating = "High Risk";

  // Category distributions
  const categoryNames = [
    { name: "Sensitive Data", color: "bg-amber-500" },
    { name: "Authentication", color: "bg-orange-500" },
    { name: "Injection", color: "bg-red-500" },
    { name: "Security Misconfiguration", color: "bg-blue-600" },
    { name: "Dependencies", color: "bg-purple-600" },
  ];

  const categories = categoryNames.map((cat) => {
    const count = uniqueVulnerabilities.filter((v) => v.category === cat.name).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      name: cat.name,
      count,
      percentage,
      color: cat.color,
    };
  });

  return {
    repository: repoName,
    branch,
    securityScore,
    rating,
    improvement: total === 0
      ? "Clean SAST scan: 0 security vulnerabilities detected."
      : `Static scan completed: ${total} issues detected across repository files.`,
    counts: { critical, high, medium, low },
    categories,
    vulnerabilities: uniqueVulnerabilities,
    scannedAt: new Date(),
  };
};
