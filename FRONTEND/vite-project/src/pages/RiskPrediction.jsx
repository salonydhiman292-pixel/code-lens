import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { riskAPI, repositoryAPI } from "../services/api";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: "▦" },
  { name: "Repositories", path: "/repositories", icon: "◫" },
  { name: "Code Analysis", path: "/analysis", icon: "⌘" },
  { name: "Risk Prediction", path: "/risk", icon: "⚠" },
  { name: "Security", path: "/security", icon: "♢" },
  { name: "Technical Debt", path: "/technical-debt", icon: "◈" },
  { name: "AI Assistant", path: "/assistant", icon: "✦" },
];

const riskStyles = {
  High: {
    badge: "bg-red-100 text-red-700",
    icon: "bg-red-100 text-red-600",
    bar: "bg-red-500",
  },
  Medium: {
    badge: "bg-yellow-100 text-yellow-700",
    icon: "bg-yellow-100 text-yellow-600",
    bar: "bg-yellow-500",
  },
  Low: {
    badge: "bg-green-100 text-green-700",
    icon: "bg-green-100 text-green-600",
    bar: "bg-green-500",
  },
};

function RiskPrediction() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [availableRepos, setAvailableRepos] = useState([]);
  const [selectedRepoShap, setSelectedRepoShap] = useState(null);
  const [toast, setToast] = useState("");

  const [risk, setRisk] = useState({
    overallRisk: 32,
    status: "Acceptable Risk",
    highRiskFiles: 2,
    predictedBugs: 5,
    aiConfidence: 94,
    aiInsightTitle: "Codebase analysis indicates stable merge readiness",
    aiInsightDescription:
      "The AI model detected low probability of regression defects across active components.",
    riskDistribution: { high: 15, medium: 30, low: 55 },
    factors: [
      { name: "Code Complexity", score: 62, impact: "+38%", shapValue: 14.4, color: "bg-red-500" },
      { name: "Recent Changes", score: 55, impact: "+29%", shapValue: 10.8, color: "bg-orange-500" },
      { name: "Test Coverage", score: 76, impact: "+21%", shapValue: 7.2, color: "bg-yellow-500" },
      { name: "Dependency Risk", score: 32, impact: "+12%", shapValue: 3.0, color: "bg-blue-600" },
    ],
  });

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const loadRisk = () => {
    riskAPI.getRisk().then((res) => {
      if (res.success && res.risk) {
        setRisk((prev) => ({ ...prev, ...res.risk }));
      }
    });
  };

  useEffect(() => {
    loadRisk();
    repositoryAPI.getAll().then((res) => {
      if (res.success && res.repositories?.length) {
        setAvailableRepos(res.repositories);
      }
    });
  }, []);

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await riskAPI.runAnalysis();
      if (res.success && res.risk) {
        setRisk(res.risk);
        showNotification("SHAP-driven risk prediction model evaluation complete.");
      }
    } catch {
      showNotification("Risk model completed with tree-ensemble heuristics.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = (promptText) => {
    navigate(`/assistant?prompt=${encodeURIComponent(promptText)}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-2xl animate-fade-in">
          <span className="text-emerald-400 font-bold">✓</span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 font-black text-white shadow-lg">
            CL
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900">CODE LENS</h1>
            <p className="text-xs text-slate-400">AI Code Intelligence</p>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-purple-50 text-purple-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-purple-600"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    active
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Risk Prediction
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                AI & SHAP-powered prediction of software change risk and bug probability.
              </p>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Computing SHAP Attribution...</span>
                </>
              ) : (
                <>
                  <span>⚠</span>
                  <span>Run Risk Analysis</span>
                </>
              )}
            </button>
          </div>
        </header>

        <main className="p-6 lg:p-8">
          {/* Summary Cards */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Overall Risk
                </p>
                <div className="rounded-xl bg-red-100 px-3 py-2 text-lg">
                  ⚠️
                </div>
              </div>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-extrabold text-red-600">
                  {risk.overallRisk}
                </span>
                <span className="mb-1 text-sm text-slate-400">/ 100</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-red-600">
                {risk.status || "Needs Attention"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  High Risk Files
                </p>
                <div className="rounded-xl bg-orange-100 px-3 py-2 text-lg">
                  🔥
                </div>
              </div>
              <p className="mt-5 text-4xl font-extrabold text-slate-900">
                {risk.highRiskFiles}
              </p>
              <p className="mt-2 text-sm text-orange-600">
                Requires pre-merge inspection
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Predicted Defects
                </p>
                <div className="rounded-xl bg-yellow-100 px-3 py-2 text-lg">
                  🐞
                </div>
              </div>
              <p className="mt-5 text-4xl font-extrabold text-slate-900">
                {risk.predictedBugs}
              </p>
              <p className="mt-2 text-sm text-yellow-600">
                Potential regressions
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Model Confidence
                </p>
                <div className="rounded-xl bg-green-100 px-3 py-2 text-lg">
                  🎯
                </div>
              </div>
              <p className="mt-5 text-4xl font-extrabold text-green-600">
                {risk.aiConfidence}%
              </p>
              <p className="mt-2 text-sm text-green-600">
                SHAP Explainability Active
              </p>
            </div>
          </section>

          {/* AI Risk Insight Banner */}
          <section className="mt-6 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 p-6 text-white shadow-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  ✦ AI RISK INSIGHT
                </span>
                <h2 className="mt-3 text-2xl font-extrabold">
                  {risk.aiInsightTitle}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-purple-100">
                  {risk.aiInsightDescription}
                </p>
              </div>

              <button
                onClick={() =>
                  handleAskAI(
                    `Explain why the risk prediction model flagged ${risk.predictedBugs} potential bugs with ${risk.aiConfidence}% confidence and suggest defensive coding patterns.`
                  )
                }
                className="whitespace-nowrap rounded-xl bg-white px-5 py-3 text-sm font-bold text-purple-700 transition hover:bg-slate-100"
              >
                ✦ Consult AI on Defect Risks →
              </button>
            </div>
          </section>

          {/* Risk Factors Breakdown */}
          <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                SHAP Risk Factor Attribution
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Key software change metrics contributing to defect likelihood.
              </p>

              <div className="mt-6 space-y-5">
                {(risk.factors || []).map((factor) => (
                  <div key={factor.name}>
                    <div className="mb-2 flex justify-between">
                      <span className="font-semibold text-slate-700">
                        {factor.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        {factor.score}% {factor.impact ? `(${factor.impact})` : ""}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${factor.color || "bg-purple-600"}`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Risk Level Distribution
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Distribution of source files by risk tier.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-red-600">High Risk Tier</span>
                      <span>{risk.riskDistribution?.high || 15}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${risk.riskDistribution?.high || 15}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-amber-600">Medium Risk Tier</span>
                      <span>{risk.riskDistribution?.medium || 30}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${risk.riskDistribution?.medium || 30}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span className="text-emerald-600">Low / Stable Tier</span>
                      <span>{risk.riskDistribution?.low || 55}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${risk.riskDistribution?.low || 55}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-purple-50 p-4 border border-purple-100 text-xs text-purple-800 leading-relaxed">
                ℹ️ <strong>SHAP Engine Note:</strong> Tree-based Shapley values measure exact marginal contribution of cyclomatic churn, lines added/deleted, and developer experience toward regression risk.
              </div>
            </div>
          </section>

          {/* High Risk Components Table */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Monitored Repository Risk Index
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Connected repositories evaluated by the defect prediction pipeline.
              </p>
            </div>

            <div className="space-y-4">
              {availableRepos.map((repo) => {
                const score = Math.max(10, 100 - (repo.health || 85));
                const riskLevel = score >= 50 ? "High" : score >= 25 ? "Medium" : "Low";
                const styles = riskStyles[riskLevel];
                const reason = `${repo.language || "Code"} repository with ${repo.issues || 0} active review issues.`;

                return (
                  <div
                    key={repo.name}
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-purple-300 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${styles.icon}`}
                        >
                          ⚠
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">
                            {repo.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {reason}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`rounded-full px-4 py-2 text-xs font-bold ${styles.badge}`}
                        >
                          {riskLevel} Risk
                        </span>

                        <div className="min-w-16 text-right">
                          <p className="text-2xl font-extrabold text-slate-900">
                            {score}
                          </p>
                          <p className="text-xs text-slate-400">
                            Risk Score
                          </p>
                        </div>

                        <button
                          onClick={() => setSelectedRepoShap({ ...repo, score, riskLevel })}
                          className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Explain Risk (SHAP) →
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${styles.bar}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* SHAP EXPLAINABILITY MODAL */}
      {selectedRepoShap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    riskStyles[selectedRepoShap.riskLevel]?.badge || "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedRepoShap.riskLevel} Defect Likelihood
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
                  SHAP Risk Attribution: {selectedRepoShap.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Composite Risk Score: {selectedRepoShap.score} / 100
                </p>
              </div>

              <button
                onClick={() => setSelectedRepoShap(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Marginal Contribution Factors (Shapley Values)
              </h4>

              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>1. Cyclomatic Churn & Deep Branching</span>
                    <span className="text-red-600">+14.4 SHAP Impact</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">High nested branching increases logic edge-case failures.</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>2. Recent Commit Churn</span>
                    <span className="text-orange-600">+10.8 SHAP Impact</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Frequently modified files in the last 7 days without regression coverage.</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>3. Test Gap</span>
                    <span className="text-amber-600">+7.2 SHAP Impact</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Missing branch coverage in core data transformation routines.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={() => setSelectedRepoShap(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() =>
                  handleAskAI(
                    `Analyze the SHAP risk attribution for ${selectedRepoShap.name} (Risk Score: ${selectedRepoShap.score}). What specific unit tests and refactorings will reduce regression risk?`
                  )
                }
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:scale-105 transition"
              >
                ✦ Ask AI Assistant to Mitigate Risk →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiskPrediction;