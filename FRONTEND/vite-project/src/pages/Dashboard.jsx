import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { dashboardAPI } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState([
    { title: "Code Health", value: "--", change: "...", icon: "⌘", bg: "bg-violet-50", text: "text-violet-600" },
    { title: "Risk Score", value: "--", change: "...", icon: "⚠", bg: "bg-blue-50", text: "text-blue-600" },
    { title: "Security Issues", value: "--", change: "...", icon: "♢", bg: "bg-red-50", text: "text-red-500" },
    { title: "Technical Debt", value: "--", change: "...", icon: "◈", bg: "bg-amber-50", text: "text-amber-600" },
  ]);
  const [qualityOverview, setQualityOverview] = useState([
    { name: "Maintainability", value: 85 },
    { name: "Reliability", value: 82 },
    { name: "Security", value: 88 },
    { name: "Test Coverage", value: 76 },
    { name: "Code Duplication", value: 80 },
  ]);
  const [riskScore, setRiskScore] = useState({
    score: 18,
    level: "Low Risk",
    high: 2,
    medium: 4,
    low: 8,
  });
  const [changes, setChanges] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [userName, setUserName] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("code_lens_user"));
      return u?.name || "Developer";
    } catch {
      return "Developer";
    }
  });

  useEffect(() => {
    dashboardAPI.getSummary().then((res) => {
      if (res.success) {
        if (res.stats) setStats(res.stats);
        if (res.qualityOverview) setQualityOverview(res.qualityOverview);
        if (res.riskScore) setRiskScore(res.riskScore);
        if (res.recentChanges) setChanges(res.recentChanges);
        if (res.repositories) setRepositories(res.repositories);
        if (res.user?.name && !localStorage.getItem("code_lens_user")) {
          setUserName(res.user.name);
        }
      }
    });
  }, []);

  return (
    <Layout
      title="Dashboard"
      subtitle="Overview of your codebase"
    >
      {/* Welcome */}
      <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-6 text-white shadow-xl shadow-indigo-100 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              AI Code Intelligence
            </span>

            <h1 className="mt-4 text-2xl font-bold md:text-3xl">
              Welcome back, {userName} 👋
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 md:text-base">
              Here's what's happening across your repositories.
              Your codebase is connected and synchronized with live intelligence.
            </p>
          </div>

          <div className="hidden h-28 w-28 items-center justify-center rounded-3xl bg-white/10 text-5xl backdrop-blur md:flex">
            ✦
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${stat.bg} ${stat.text}`}
              >
                {stat.icon}
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  stat.change?.startsWith("+")
                    ? "bg-green-50 text-green-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {stat.change}
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              {stat.title}
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              {stat.value}
            </h2>
          </div>
        ))}
      </section>

      {/* Main Analytics */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Quality */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">
                Code Quality Overview
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Latest analysis across all connected repositories
              </p>
            </div>

            <span className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-600">
              Live Evaluation
            </span>
          </div>

          <div className="mt-7 space-y-5">
            {qualityOverview.map((item) => (
              <QualityBar
                key={item.name}
                label={item.name}
                value={item.value}
              />
            ))}
          </div>
        </div>

        {/* Risk */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">
            Risk Score
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Current project risk evaluation
          </p>

          <div
            className="relative mx-auto mt-8 flex h-48 w-48 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#8b5cf6 0deg ${Math.round(
                (riskScore.score / 100) * 360
              )}deg, #e2e8f0 ${Math.round((riskScore.score / 100) * 360)}deg 360deg)`,
            }}
          >
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white">
              <span className="text-4xl font-bold text-slate-900">
                {riskScore.score}%
              </span>

              <span className="text-xs text-slate-400">
                {riskScore.level || "Low Risk"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-between text-center">
            <div>
              <p className="text-xl font-bold text-red-500">
                {riskScore.high}
              </p>
              <p className="text-xs text-slate-400">
                High
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-amber-500">
                {riskScore.medium}
              </p>
              <p className="text-xs text-slate-400">
                Medium
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-green-500">
                {riskScore.low}
              </p>
              <p className="text-xs text-slate-400">
                Low
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Changes */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h3 className="font-bold text-slate-900">
              Recent Code Changes
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Latest commits and branches analyzed by Code Lens
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {changes.length > 0 ? (
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase text-slate-400">
                  <th className="px-6 py-4">Commit / Event</th>
                  <th className="px-6 py-4">Repository</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {changes.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      {item.commit}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {item.repo}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {item.author}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {item.time}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "Passed"
                            ? "bg-green-50 text-green-600"
                            : item.status === "Warning"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              No recent changes recorded yet. Connect a repository to start tracking changes.
            </div>
          )}
        </div>
      </section>

      {/* Repository Health */}
      <section className="mt-6">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900">
            Repository Health
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Health score of your active repositories
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {repositories.map((repo) => (
            <div
              key={repo.name}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
                    ◫
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {repo.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {repo.issues || 0} issues found
                    </p>
                  </div>
                </div>

                <span className="text-lg font-bold text-slate-900">
                  {repo.health}%
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    repo.health >= 90
                      ? "bg-green-500"
                      : repo.health >= 75
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${repo.health}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-400">
                <span>Health</span>

                <span>
                  {repo.health >= 90
                    ? "Excellent"
                    : repo.health >= 75
                    ? "Good"
                    : "Needs Attention"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function QualityBar({ label, value }) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>

        <span className="text-sm font-bold text-slate-800">
          {value}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default Dashboard;