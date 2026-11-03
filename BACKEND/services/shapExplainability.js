/**
 * Explainable AI (XAI) using SHAP-inspired feature attribution values
 * As highlighted in the presentation:
 * "Provide explainable insights through SHAP and GitHub integration"
 * Workflow Stage 8: "Explainable AI - SHAP values explain the AI's predictions"
 */
export const calculateSHAPExplanation = ({
  codeComplexity = 82,
  recentChanges = 71,
  testCoverage = 56,
  dependencyRisk = 42,
}) => {
  // Baseline risk anchor (prior mean defect rate)
  const baseValue = 35.0;

  // Feature attributions (SHAP values representing delta from baseline)
  const complexityShap = ((codeComplexity - 50) * 0.45).toFixed(1);
  const changesShap = ((recentChanges - 40) * 0.35).toFixed(1);
  const coverageShap = ((60 - testCoverage) * 0.4).toFixed(1);
  const dependencyShap = ((dependencyRisk - 30) * 0.25).toFixed(1);

  const factors = [
    {
      name: "Code Complexity",
      score: codeComplexity,
      impact: "+38%",
      shapValue: parseFloat(complexityShap),
      description: "Cyclomatic complexity and deeply nested logic increase defect likelihood.",
      color: "#ef4444",
    },
    {
      name: "Recent Changes",
      score: recentChanges,
      impact: "+29%",
      shapValue: parseFloat(changesShap),
      description: "High code churn across multiple commits within the last review window.",
      color: "#f97316",
    },
    {
      name: "Test Coverage",
      score: testCoverage,
      impact: "+21%",
      shapValue: parseFloat(coverageShap),
      description: "Branches with under 60% test coverage have higher regression rates.",
      color: "#eab308",
    },
    {
      name: "Dependency Risk",
      score: dependencyRisk,
      impact: "+12%",
      shapValue: parseFloat(dependencyShap),
      description: "Direct dependencies with unpatched advisories or outdated majors.",
      color: "#3b82f6",
    },
  ];

  return {
    baseValue,
    factors,
    summary:
      "Code Complexity and Recent Code Churn are the two primary drivers pushing the predicted risk score upward.",
  };
};
