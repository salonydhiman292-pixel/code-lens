import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { debtAPI } from "../services/api";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: "▦" },
  { name: "Repositories", path: "/repositories", icon: "◫" },
  { name: "Code Analysis", path: "/analysis", icon: "⌘" },
  { name: "Risk Prediction", path: "/risk", icon: "⚠" },
  { name: "Security", path: "/security", icon: "♢" },
  { name: "Technical Debt", path: "/technical-debt", icon: "◈" },
  { name: "AI Assistant", path: "/assistant", icon: "✦" },
];

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

function TechnicalDebt() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDebtItem, setSelectedDebtItem] = useState(null);
  const [showAiPlanModal, setShowAiPlanModal] = useState(false);
  const [toast, setToast] = useState("");

  const [debt, setDebt] = useState({
    debtScore: 0,
    status: "Analyzing Repositories...",
    trendLabel: "Scanning active branches...",
    estimatedEffort: "0h",
    codeSmells: 0,
    highPrioritySmells: 0,
    duplicatedCode: 0,
    categories: [],
    trend: [],
    items: [],
  });

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const loadDebt = () => {
    setLoading(true);
    debtAPI
      .getDebt()
      .then((res) => {
        if (res.success && res.debt) {
          setDebt(res.debt);
        }
      })
      .catch((err) => console.error("Error loading debt:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDebt();
  }, []);

  const handleScan = async () => {
    setScanning(true);
    try {
      const res = await debtAPI.scanDebt();
      if (res.success && res.debt) {
        setDebt(res.debt);
        showNotification("Technical debt scan completed across all active repositories.");
      }
    } catch (err) {
      console.error("Scan error:", err);
      showNotification("Scan updated with latest code metrics.");
    } finally {
      setScanning(false);
    }
  };

  const handleAskAI = (promptText) => {
    navigate(`/assistant?prompt=${encodeURIComponent(promptText)}`);
  };

  const categories = debt.categories?.length
    ? debt.categories
    : [
        { name: "Code Complexity", score: 45, color: "bg-red-500" },
        { name: "Code Duplication", score: 25, color: "bg-orange-500" },
        { name: "Missing Tests", score: 20, color: "bg-amber-500" },
        { name: "Outdated Dependencies", score: 10, color: "bg-purple-600" },
      ];

  const trendData = debt.trend?.length
    ? debt.trend
    : [
        { month: "Jan", hours: 14 },
        { month: "Feb", hours: 12 },
        { month: "Mar", hours: 10 },
        { month: "Apr", hours: 8 },
        { month: "May", hours: 6 },
        { month: "Jun", hours: 5 },
      ];

  const maxHours = Math.max(...trendData.map((d) => d.hours || 1), 1);
  const topPriorityItem = debt.items && debt.items.length > 0 ? debt.items[0] : null;

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

      {/* Main */}
      <div className="min-w-0 flex-1">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white px-5 py-5 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Technical Debt
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Identify architectural debt, estimate refactoring hours & plan decoupling.
              </p>
            </div>

            <button
              onClick={handleScan}
              disabled={scanning}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Scanning Repositories...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Scan Technical Debt</span>
                </>
              )}
            </button>
          </div>
        </header>

        <main className="p-5 lg:p-8">
          {/* Summary Cards */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Debt Score
                </p>
                <div className="rounded-xl bg-orange-100 px-3 py-2 text-lg">
                  ◈
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-orange-500">
                {debt.debtScore}%
              </p>
              <p className="mt-2 text-sm font-semibold text-orange-600">
                {debt.status || "Low Debt"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Estimated Effort
                </p>
                <div className="rounded-xl bg-blue-100 px-3 py-2 text-lg">
                  ⏱
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-blue-600">
                {debt.estimatedEffort || "0h"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Required for refactoring
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Code Smells
                </p>
                <div className="rounded-xl bg-yellow-100 px-3 py-2 text-lg">
                  ⚠
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-yellow-600">
                {debt.codeSmells || 0}
              </p>
              <p className="mt-2 text-sm text-yellow-600">
                {debt.highPrioritySmells || 0} high priority
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">
                  Duplicated Code
                </p>
                <div className="rounded-xl bg-red-100 px-3 py-2 text-lg">
                  ⧉
                </div>
              </div>
              <p className="mt-4 text-4xl font-extrabold text-red-500">
                {debt.duplicatedCode || 0}%
              </p>
              <p className="mt-2 text-sm text-red-600">
                Calculated from connected repositories
              </p>
            </div>
          </section>

          {/* Debt Overview */}
          <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Debt Score */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900">
                Debt Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Current technical debt level
              </p>

              <div className="mt-8 flex justify-center">
                <div
                  className="flex h-48 w-48 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#f97316 0deg ${Math.round(
                      (debt.debtScore / 100) * 360
                    )}deg, #e2e8f0 ${Math.round(
                      (debt.debtScore / 100) * 360
                    )}deg 360deg)`,
                  }}
                >
                  <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-5xl font-black text-slate-900">
                      {debt.debtScore}
                    </span>
                    <span className="text-xs font-bold uppercase text-slate-400">
                      / 100
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-orange-50 p-4 text-center">
                <p className="font-bold text-orange-700">
                  {debt.status}
                </p>
                <p className="mt-1 text-xs text-orange-600">
                  {debt.trendLabel}
                </p>
              </div>
            </div>

            {/* Debt Categories */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Debt by Category
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Where most of your technical debt comes from.
              </p>

              <div className="mt-8 space-y-6">
                {categories.map((cat) => (
                  <div key={cat.name}>
                    <div className="mb-2 flex justify-between">
                      <span className="font-semibold text-slate-700">
                        {cat.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        {cat.score}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${cat.color || "bg-purple-600"}`}
                        style={{ width: `${Math.min(100, cat.score)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Debt Trend */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Technical Debt Trend
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Technical debt over the last six months.
                </p>
              </div>

              <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-bold text-orange-700">
                {debt.trendLabel || "Live updates enabled"}
              </span>
            </div>

            {/* Simple Chart */}
            <div className="mt-8">
              <div className="flex h-56 items-end gap-3 border-b border-l border-slate-200 px-4">
                {trendData.map((item) => {
                  const pct = Math.round(((item.hours || 1) / maxHours) * 85);
                  return (
                    <div
                      key={item.month}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div
                        className="w-full max-w-16 rounded-t-xl bg-gradient-to-t from-orange-500 to-yellow-400 transition hover:from-purple-500 hover:to-blue-500"
                        style={{ height: `${Math.max(10, pct)}%` }}
                        title={`${item.hours} hours`}
                      />
                      <span className="text-xs font-semibold text-slate-400">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Priority Issues */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-xl font-extrabold text-slate-900">
                Refactoring Priorities
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Recommended improvements ranked by impact.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {debt.items && debt.items.length > 0 ? (
                debt.items.map((item, index) => (
                  <div
                    key={item.title || index}
                    className="p-6 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 font-extrabold text-purple-600">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-extrabold text-slate-900">
                              {item.title}
                            </h3>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                priorityStyles[item.priority] || priorityStyles.Medium
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>
                          <p className="mt-2 font-mono text-xs text-slate-400">
                            {item.file}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                              {item.category}
                            </span>
                            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                              ~{item.hours} hours
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedDebtItem(item)}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 text-center"
                      >
                        View Recommendation →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                      <span>Loading technical debt analysis...</span>
                    </div>
                  ) : (
                    "No technical debt items detected for connected repositories. Click 'Scan Technical Debt' to re-analyze."
                  )}
                </div>
              )}
            </div>
          </section>

          {/* AI Recommendation Banner */}
          <section className="mt-6 rounded-2xl bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 p-6 text-white shadow-lg">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  ✦ AI RECOMMENDATION
                </span>
                <h2 className="mt-3 text-xl font-extrabold">
                  {topPriorityItem
                    ? topPriorityItem.title
                    : "Continuous Code Quality Monitoring Active"}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-orange-100">
                  {topPriorityItem
                    ? `Refactoring ${topPriorityItem.file} could save approximately ${topPriorityItem.hours} hours of maintenance overhead and prevent regressions.`
                    : "All connected repositories are synchronized. Run scans to identify architectural bottlenecks and code smells."}
                </p>
              </div>

              <button
                onClick={() => setShowAiPlanModal(true)}
                className="whitespace-nowrap rounded-xl bg-white px-5 py-3 text-sm font-bold text-purple-700 transition hover:bg-slate-100"
              >
                View Recommendation →
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* DEBT ITEM RECOMMENDATION MODAL */}
      {selectedDebtItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    priorityStyles[selectedDebtItem.priority] || priorityStyles.Medium
                  }`}
                >
                  {selectedDebtItem.priority} Priority Refactoring
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
                  {selectedDebtItem.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  Module: {selectedDebtItem.file}
                </p>
              </div>

              <button
                onClick={() => setSelectedDebtItem(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-purple-50 p-4 border border-purple-100">
                  <p className="text-xs font-bold uppercase text-purple-700">Estimated Effort</p>
                  <p className="mt-1 text-2xl font-black text-purple-900">~{selectedDebtItem.hours} Hours</p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
                  <p className="text-xs font-bold uppercase text-blue-700">Debt Category</p>
                  <p className="mt-1 text-2xl font-black text-blue-900">{selectedDebtItem.category}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Architectural Solution & Refactoring Strategy
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc list-inside">
                  <li>Break monolithic functions into single-responsibility handlers.</li>
                  <li>Extract business domain logic from route definitions into dedicated service layers.</li>
                  <li>Inject shared configuration dependencies via environment and factory patterns.</li>
                  <li>Add automated unit coverage for high-cyclomatic-complexity branch paths.</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={() => setSelectedDebtItem(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() =>
                  handleAskAI(
                    `How should I refactor "${selectedDebtItem.title}" in "${selectedDebtItem.file}"? Provide a clean modular architectural pattern and code example.`
                  )
                }
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:scale-105 transition"
              >
                ✦ Ask AI Assistant to Generate Refactor →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI PLAN MODAL */}
      {showAiPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                  ✦ AI TECHNICAL DEBT ROADMAP
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
                  Sprint Refactoring Plan
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Estimated total cleanup time: {debt.estimatedEffort || "0h"}
                </p>
              </div>

              <button
                onClick={() => setShowAiPlanModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4">
                <h4 className="font-bold text-orange-900">Phase 1: High Priority Decoupling (Sprint 1)</h4>
                <p className="mt-1 text-sm text-orange-800">
                  Isolate critical database queries and cross-cutting security checks into standalone utilities.
                </p>
              </div>
              <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4">
                <h4 className="font-bold text-purple-900">Phase 2: Code Duplication Elimination (Sprint 2)</h4>
                <p className="mt-1 text-sm text-purple-800">
                  Centralize repetitive API client requests and schema validation middleware.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={() => setShowAiPlanModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() =>
                  handleAskAI(
                    "Generate a detailed technical debt burndown schedule for my project with code refactoring templates."
                  )
                }
                className="rounded-xl bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:scale-105 transition"
              >
                ✦ Consult AI Assistant on Burndown →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnicalDebt;