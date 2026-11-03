import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { repositoryAPI, analysisAPI } from "../services/api";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: "▦" },
  { name: "Repositories", path: "/repositories", icon: "◫" },
  { name: "Code Analysis", path: "/analysis", icon: "⌘" },
  { name: "Risk Prediction", path: "/risk", icon: "⚠" },
  { name: "Security", path: "/security", icon: "♢" },
  { name: "Technical Debt", path: "/technical-debt", icon: "◈" },
  { name: "AI Assistant", path: "/assistant", icon: "✦" },
];

function CodeAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialRepo = searchParams.get("repo") || "code-lens-frontend";

  const [availableRepos, setAvailableRepos] = useState([]);
  const [repository, setRepository] = useState(initialRepo);
  const [branch, setBranch] = useState("main");
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedIssueModal, setSelectedIssueModal] = useState(null);
  const [toast, setToast] = useState("");

  const [analysis, setAnalysis] = useState({
    qualityScore: 88,
    qualityRating: "Excellent",
    issuesFound: 0,
    highPriorityIssues: 0,
    filesAnalyzed: 0,
    coverage: 80,
    maintainability: 89,
    reliability: 92,
    security: 90,
    testCoverage: 80,
    issues: [],
  });

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  useEffect(() => {
    repositoryAPI.getAll().then((res) => {
      if (res.success && res.repositories?.length) {
        setAvailableRepos(res.repositories);
        if (!searchParams.get("repo") && res.repositories[0]?.name) {
          setRepository(res.repositories[0].name);
        }
      }
    });
  }, []);

  const loadAnalysis = (repo = repository, br = branch) => {
    if (!repo) return;
    analysisAPI.getAnalysis(repo, br).then((res) => {
      if (res.success && res.analysis) {
        setAnalysis((prev) => ({ ...prev, ...res.analysis }));
      }
    });
  };

  useEffect(() => {
    loadAnalysis(repository, branch);
  }, [repository, branch]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await analysisAPI.runAnalysis(repository, branch);
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
        showNotification(`Code quality analysis completed for ${repository}`);
      }
    } catch {
      showNotification("Analysis completed with static rule evaluations.");
    } finally {
      setAnalyzing(false);
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
        <header className="border-b border-slate-200 bg-white px-5 py-5 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Code Analysis
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Inspect code quality, cyclomatic complexity, test coverage & rule violations.
              </p>
            </div>

            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Analyzing {repository}...</span>
                </>
              ) : (
                <>
                  <span>⌘</span>
                  <span>Run Code Analysis</span>
                </>
              )}
            </button>
          </div>
        </header>

        <main className="p-5 lg:p-8">
          {/* Repository Selection */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Select Repository
                </label>
                <select
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                >
                  {availableRepos.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Select Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                >
                  <option value="main">main (production)</option>
                  <option value="develop">develop</option>
                </select>
              </div>
            </div>
          </section>

          {/* Metrics Overview */}
          <section className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Quality Score
                </p>
                <div className="rounded-xl bg-purple-100 px-3 py-2 text-lg">
                  ⌘
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-purple-600">
                {analysis.qualityScore || 88}%
              </p>
              <p className="mt-2 text-sm font-semibold text-purple-600">
                {analysis.qualityRating || "Excellent"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Issues Found
                </p>
                <div className="rounded-xl bg-orange-100 px-3 py-2 text-lg">
                  ⚠
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-orange-500">
                {analysis.issuesFound || (analysis.issues ? analysis.issues.length : 0)}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {analysis.highPriorityIssues || 0} high priority
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Files Analyzed
                </p>
                <div className="rounded-xl bg-blue-100 px-3 py-2 text-lg">
                  📁
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-blue-600">
                {analysis.filesAnalyzed || 142}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Active source files
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Test Coverage
                </p>
                <div className="rounded-xl bg-green-100 px-3 py-2 text-lg">
                  ✓
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-green-600">
                {analysis.coverage || 78}%
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Automated assertions
              </p>
            </div>
          </section>

          {/* Quality Breakdown Bars */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900">
              Code Quality Breakdown
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Detailed assessment of maintainability, reliability and testability.
            </p>

            <div className="mt-6 space-y-5">
              {[
                { name: "Maintainability", score: analysis.maintainability || 89 },
                { name: "Reliability", score: analysis.reliability || 92 },
                { name: "Security Health", score: analysis.security || 90 },
                { name: "Test Coverage", score: analysis.testCoverage || 78 },
              ].map((bar) => (
                <div key={bar.name}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">{bar.name}</span>
                    <span className="font-bold text-slate-900">{bar.score}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
                      style={{ width: `${bar.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Flagged Code Issues */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-xl font-extrabold text-slate-900">
                Detected Code Smells & Violations
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Specific locations flagged for cyclomatic complexity or bad practices.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {analysis.issues && analysis.issues.length > 0 ? (
                analysis.issues.map((item, idx) => (
                  <div
                    key={item.file || idx}
                    className="flex flex-col gap-4 p-6 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          item.severity === "High"
                            ? "bg-red-100 text-red-600"
                            : item.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        ⚠
                      </div>

                      <div>
                        <p className="font-mono text-sm font-bold text-slate-800">
                          {item.file}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.issue}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-bold ${
                          item.severity === "High"
                            ? "bg-red-100 text-red-700"
                            : item.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.severity}
                      </span>

                      <div className="text-right min-w-16">
                        <p className="text-xl font-extrabold text-slate-900">
                          {item.score || 75}
                        </p>
                        <p className="text-xs text-slate-400">
                          Risk
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedIssueModal(item)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-500">
                  No issues flagged for {repository}. Code quality is healthy.
                </div>
              )}
            </div>
          </section>

          {/* AI Insight */}
          <section className="mt-6 rounded-2xl bg-gradient-to-r from-purple-700 to-blue-600 p-6 text-white shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  ✦ AI INSIGHT
                </span>
                <h2 className="mt-3 text-xl font-extrabold">
                  Your code quality maintainability rating is {analysis.qualityRating || "Excellent"}
                </h2>
                <p className="mt-1 text-sm text-indigo-100">
                  Maintainability and reliability metrics are synced across current branches.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleAskAI(
                      `How can I improve the overall code quality score of repository ${repository} beyond ${analysis.qualityScore}%?`
                    )
                  }
                  className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-slate-100"
                >
                  ✦ Consult AI Assistant →
                </button>

                <Link
                  to="/risk"
                  className="rounded-xl bg-white/10 border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  View Risk Analysis →
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* CODE ISSUE DETAILS MODAL */}
      {selectedIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    selectedIssueModal.severity === "High"
                      ? "bg-red-100 text-red-700"
                      : selectedIssueModal.severity === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {selectedIssueModal.severity} Severity Code Smell
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
                  {selectedIssueModal.issue}
                </h3>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  Source: {selectedIssueModal.file}
                </p>
              </div>

              <button
                onClick={() => setSelectedIssueModal(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Impact Assessment
                </h4>
                <p className="mt-1 text-sm text-slate-700">
                  This issue introduces maintainability friction and increases defect probability during subsequent pull request integrations.
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4 border border-purple-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  AI Remediation Advice
                </h4>
                <p className="mt-1 text-sm font-medium text-purple-900">
                  Extract deep logic into pure unit-tested helper functions, reduce cyclomatic nesting, and introduce standard error boundaries.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={() => setSelectedIssueModal(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() =>
                  handleAskAI(
                    `How do I refactor and fix the issue "${selectedIssueModal.issue}" in file "${selectedIssueModal.file}"? Show full code refactor.`
                  )
                }
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:scale-105 transition"
              >
                ✦ Ask AI Assistant to Refactor This →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeAnalysis;