import SecurityScan from "../models/SecurityScan.js";
import Repository from "../models/Repository.js";
import { performActualSecurityScan } from "../services/staticAnalysisService.js";

export const getSecurityScan = async (req, res) => {
  try {
    let { repository, severity, branch = "main" } = req.query;

    if (!repository) {
      const first = await Repository.findOne().lean();
      repository = first ? first.name : "salonydhiman292-pixel/code-lens";
    }

    let scan = await SecurityScan.findOne({ repository }).lean();

    if (!scan) {
      scan = await performActualSecurityScan(repository, branch);
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
    const { repository = "salonydhiman292-pixel/code-lens", branch = "main" } = req.body;

    const actualScanResult = await performActualSecurityScan(repository, branch);

    const saved = await SecurityScan.findOneAndUpdate(
      { repository },
      actualScanResult,
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: `Actual SAST scan completed: ${actualScanResult.vulnerabilities.length} vulnerabilities detected.`,
      security: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
