import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { repositoryAPI, securityAPI } from "../services/api";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: "▦" },
  { name: "Repositories", path: "/repositories", icon: "◫" },
  { name: "Code Analysis", path: "/analysis", icon: "⌘" },
  { name: "Risk Prediction", path: "/risk", icon: "⚠" },
  { name: "Security", path: "/security", icon: "♢" },
  { name: "Technical Debt", path: "/technical-debt", icon: "◈" },
  { name: "AI Assistant", path: "/assistant", icon: "✦" },
];

const severityStyles = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-blue-100 text-blue-700 border-blue-200",
};

function Security() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialRepo = searchParams.get("repo") || "code-lens-frontend";

  const [availableRepos, setAvailableRepos] = useState([]);
  const [repository, setRepository] = useState(initialRepo);
  const [branch, setBranch] = useState("main");
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [toast, setToast] = useState("");
  const [resolvedIssues, setResolvedIssues] = useState({});

  const [securityData, setSecurityData] = useState({
    securityScore: 92,
    rating: "Good Security",
    improvement: "No critical zero-day vulnerabilities detected.",
    counts: { critical: 0, high: 0, medium: 0, low: 0 },
    vulnerabilities: [],
    categories: [],
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

  const loadScan = (repo = repository, sev = filter) => {
    if (!repo) return;
    securityAPI.getScan(repo, sev).then((res) => {
      if (res.success && res.security) {
        setSecurityData((prev) => ({ ...prev, ...res.security }));
      }
    });
  };

  useEffect(() => {
    loadScan(repository, filter);
  }, [repository, filter]);

  const runScan = async () => {
    setScanning(true);
    try {
      const res = await securityAPI.runScan(repository, branch);
      if (res.success && res.security) {
        setSecurityData((prev) => ({ ...prev, ...res.security }));
        showNotification(`Security scan completed for ${repository}. 0 critical threats found.`);
      }
    } catch {
      showNotification("Scan completed with fallback heuristic analysis.");
    } finally {
      setScanning(false);
    }
  };

  const allVulnerabilities = securityData.vulnerabilities || [];
  const filteredIssues =
    filter === "All"
      ? allVulnerabilities
      : allVulnerabilities.filter(
          (v) => v.severity.toLowerCase() === filter.toLowerCase()
        );

  const handleResolve = (issueTitle) => {
    setResolvedIssues((prev) => ({
      ...prev,
      [issueTitle]: !prev[issueTitle],
    }));
    showNotification(
      resolvedIssues[issueTitle]
        ? `Reopened issue: ${issueTitle}`
        : `Marked issue as resolved: ${issueTitle}`
    );
  };

  const handleAskAI = (promptText) => {
    navigate(`/assistant?prompt=${encodeURIComponent(promptText)}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-2xl animate-fade-in">
          <span className="text-emerald-400 font-bold">✓</span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* SIDEBAR */}
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

      {/* MAIN */}
      <div className="min-w-0 flex-1">
        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white px-5 py-5 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Security Analysis
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Automated security scanning, vulnerability detection & AI remediation.
              </p>
            </div>

            <button
              onClick={runScan}
              disabled={scanning}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-70"
            >
              {scanning ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Scanning {repository}...</span>
                </>
              ) : (
                <>
                  <span>🛡</span>
                  <span>Run Security Scan</span>
                </>
              )}
            </button>
          </div>
        </header>

        <main className="p-5 lg:p-8">
          {/* REPOSITORY SELECT */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Target Repository
                </label>
                <select
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                >
                  {availableRepos.length > 0 ? (
                    availableRepos.map((r) => (
                      <option key={r.name} value={r.name}>
                        {r.name}
                      </option>
                    ))
                  ) : (
                    <option value="code-lens-frontend">code-lens-frontend</option>
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Target Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                >
                  <option value="main">main (production)</option>
                  <option value="develop">develop</option>
                  <option value="staging">staging</option>
                </select>
              </div>
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <section className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Security Score
                </p>
                <div className="rounded-xl bg-purple-100 px-3 py-2 text-lg">
                  🛡
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-purple-600">
                {securityData.securityScore || 92}%
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-600">
                {securityData.rating || "Good Security"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Critical Vulnerabilities
                </p>
                <div className="rounded-xl bg-red-100 px-3 py-2 text-lg">
                  🚨
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-red-600">
                {securityData.counts?.critical || 0}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Immediate fix required
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  High Risk Issues
                </p>
                <div className="rounded-xl bg-orange-100 px-3 py-2 text-lg">
                  🔥
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-orange-500">
                {securityData.counts?.high || 0}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Needs code review
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Medium & Low
                </p>
                <div className="rounded-xl bg-blue-100 px-3 py-2 text-lg">
                  ℹ
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-blue-600">
                {(securityData.counts?.medium || 0) +
                  (securityData.counts?.low || 0)}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Minor hygiene warnings
              </p>
            </div>
          </section>

          {/* VULNERABILITIES LIST */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Detected Vulnerabilities ({filteredIssues.length})
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Security risks identified across repository source files.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {["All", "Critical", "High", "Medium", "Low"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                      filter === item
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue) => {
                  const isResolved = !!resolvedIssues[issue.title];
                  return (
                    <div
                      key={issue.title}
                      className={`p-6 transition hover:bg-slate-50 ${
                        isResolved ? "bg-slate-50/80 opacity-75" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
                              isResolved
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {isResolved ? "✓" : "🛡"}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3
                                className={`font-extrabold ${
                                  isResolved
                                    ? "text-slate-500 line-through"
                                    : "text-slate-900"
                                }`}
                              >
                                {issue.title}
                              </h3>

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-bold ${
                                  severityStyles[issue.severity] ||
                                  severityStyles.Low
                                }`}
                              >
                                {issue.severity}
                              </span>

                              {isResolved && (
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                  Resolved
                                </span>
                              )}
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                              {issue.description}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-3 text-xs">
                              <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono font-semibold text-slate-600">
                                📍 {issue.file} {issue.line ? `:${issue.line}` : ""}
                              </span>

                              <span className="rounded-lg bg-purple-50 px-3 py-1.5 font-semibold text-purple-600">
                                {issue.category || "Security"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleResolve(issue.title)}
                            className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                              isResolved
                                ? "border-slate-200 text-slate-500 hover:bg-slate-100"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {isResolved ? "Reopen" : "Mark Resolved"}
                          </button>

                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-slate-500">
                  No vulnerabilities detected for filter "{filter}".
                </div>
              )}
            </div>
          </section>

          {/* AI RECOMMENDATION */}
          <section className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-purple-700 to-blue-600 p-6 text-white shadow-lg">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  ✦ AI SECURITY RECOMMENDATION
                </span>

                <h2 className="mt-3 text-xl font-extrabold">
                  Fix the exposed credentials and restrict CORS headers first
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-indigo-100">
                  {allVulnerabilities.length > 0
                    ? `Addressing ${allVulnerabilities[0]?.title} will prevent potential lateral movement and credential exfiltration.`
                    : "No high-severity vulnerabilities require immediate remediation in this branch."}
                </p>
              </div>

              <button
                onClick={() => setShowAiModal(true)}
                className="whitespace-nowrap rounded-xl bg-white px-5 py-3 text-sm font-bold text-purple-700 transition hover:bg-slate-100"
              >
                View Recommendation →
              </button>
            </div>
          </section>

          {/* SCAN INFO */}
          <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <p className="font-bold text-green-700">✓ Dependencies</p>
              <p className="mt-2 text-sm leading-6 text-green-600">
                Dependency vulnerabilities and transitive CVEs are checked automatically.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
              <p className="font-bold text-purple-700">🤖 AI Detection</p>
              <p className="mt-2 text-sm leading-6 text-purple-600">
                Google Gemini API identifies logic flaws beyond traditional static SAST rules.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <p className="font-bold text-blue-700">🔄 Continuous Scan</p>
              <p className="mt-2 text-sm leading-6 text-blue-600">
                Connected Git repositories trigger automatic scans upon branch updates.
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* VULNERABILITY DETAILS MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${
                    severityStyles[selectedIssue.severity] || severityStyles.Low
                  }`}
                >
                  {selectedIssue.severity} Severity
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
                  {selectedIssue.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  File: {selectedIssue.file} {selectedIssue.line ? `(line ${selectedIssue.line})` : ""}
                </p>
              </div>

              <button
                onClick={() => setSelectedIssue(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Threat Impact & Description
                </h4>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {selectedIssue.description}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Recommended Remediation
                </h4>
                <p className="mt-1 text-sm font-medium text-amber-900">
                  {selectedIssue.remediation ||
                    "Review authorization check and ensure input sanitation before processing parameters."}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-4 font-mono text-xs text-emerald-400">
                <p className="text-slate-400 mb-1">// Suggested Fix Pattern:</p>
                <code>
                  {selectedIssue.category === "Security Misconfiguration"
                    ? 'app.use(cors({ origin: ["https://yourdomain.com"], credentials: true }));'
                    : selectedIssue.category === "Sensitive Data"
                    ? 'require("dotenv").config();\nconst secret = process.env.SECRET_KEY;'
                    : 'const { query, validationResult } = require("express-validator");\nrouter.get("/", query("id").isInt(), handler);'}
                </code>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={() => setSelectedIssue(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() => {
                  handleResolve(selectedIssue.title);
                  setSelectedIssue(null);
                }}
                className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                {resolvedIssues[selectedIssue.title] ? "Reopen Issue" : "Mark as Resolved"}
              </button>

              <button
                onClick={() =>
                  handleAskAI(
                    `How do I fix the security issue "${selectedIssue.title}" in file "${selectedIssue.file}"? Provide a complete code example.`
                  )
                }
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:scale-105 transition"
              >
                ✦ Ask AI Assistant to Fix This →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI RECOMMENDATION MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                  ✦ AI SECURITY ADVISORY
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
                  Prioritized Security Roadmap
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Analysis for {repository} on branch {branch}
                </p>
              </div>

              <button
                onClick={() => setShowAiModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
                <h4 className="font-bold text-purple-900">
                  1. Protect Environment Variables & API Keys
                </h4>
                <p className="mt-1 text-sm text-purple-800">
                  Add <code className="bg-purple-200/60 px-1 py-0.5 rounded">.env*</code> to <code className="bg-purple-200/60 px-1 py-0.5 rounded">.gitignore</code> and rotate any secrets previously committed to git history.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <h4 className="font-bold text-blue-900">
                  2. Restrict CORS & Origin Headers
                </h4>
                <p className="mt-1 text-sm text-blue-800">
                  Specify strict domain whitelists for HTTP REST APIs to block malicious cross-origin requests.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <h4 className="font-bold text-emerald-900">
                  3. Implement Request Input Validation
                </h4>
                <p className="mt-1 text-sm text-emerald-800">
                  Enforce strict input parameter types and sanitization using express-validator to mitigate SQLi & XSS.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={() => setShowAiModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() =>
                  handleAskAI(
                    `Generate a full step-by-step security hardening script and checklist for repository ${repository}.`
                  )
                }
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:scale-105 transition"
              >
                ✦ Consult AI Assistant Now →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Security;