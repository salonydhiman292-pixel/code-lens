import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { repositoryAPI } from "../services/api";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: "▦" },
  { name: "Repositories", path: "/repositories", icon: "◫" },
  { name: "Code Analysis", path: "/analysis", icon: "⌘" },
  { name: "Risk Prediction", path: "/risk", icon: "⚠" },
  { name: "Security", path: "/security", icon: "♢" },
  { name: "Technical Debt", path: "/technical-debt", icon: "◈" },
  { name: "AI Assistant", path: "/assistant", icon: "✦" },
];

function Repositories() {
  const location = useLocation();
  const [repositories, setRepositories] = useState([]);
  const [summary, setSummary] = useState({
    totalRepositories: 0,
    healthy: 0,
    needsAttention: 0,
    totalIssues: 0,
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoLang, setNewRepoLang] = useState("React");
  const [loading, setLoading] = useState(true);

  const loadRepos = () => {
    setLoading(true);
    repositoryAPI.getAll().then((res) => {
      if (res.success) {
        setRepositories(res.repositories || []);
        if (res.summary) setSummary(res.summary);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadRepos();
  }, []);

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;
    await repositoryAPI.connect({
      name: newRepoName.trim(),
      language: newRepoLang,
    });
    setNewRepoName("");
    setShowModal(false);
    loadRepos();
  };

  const handleAnalyze = async (name) => {
    await repositoryAPI.analyze(name);
    loadRepos();
  };

  const handleDelete = async (idOrName) => {
    if (!window.confirm(`Are you sure you want to remove "${idOrName}"?`)) return;
    await repositoryAPI.delete(idOrName);
    loadRepos();
  };

  const filteredRepositories = repositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      repo.language.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Healthy" && repo.health >= 80) ||
      (filter === "Attention" && repo.health < 80);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">

        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 font-black text-white shadow-lg">
            CL
          </div>

          <div>
            <h1 className="font-extrabold text-slate-900">
              CODE LENS
            </h1>
            <p className="text-xs text-slate-400">
              AI Code Intelligence
            </p>
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

        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Repositories
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and monitor your connected repositories.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]"
          >
            + Connect Repository
          </button>
        </header>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-slate-900">Connect GitHub Repository</h2>
              <p className="mt-1 text-sm text-slate-500">Add a repository to begin AI change analysis</p>
              <form onSubmit={handleConnect} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Repository Name</label>
                  <input
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    placeholder="e.g. org/auth-service"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Primary Language</label>
                  <select
                    value={newRepoLang}
                    onChange={(e) => setNewRepoLang(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-purple-600"
                  >
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="TypeScript">TypeScript</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-bold text-white shadow hover:bg-purple-700"
                  >
                    Connect
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <main className="p-5 lg:p-8">

          {/* Summary */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Total Repositories
              </p>
              <p className="mt-3 text-4xl font-extrabold text-slate-900">
                {summary.totalRepositories}
              </p>
              <p className="mt-2 text-sm text-purple-600">
                {repositories.length} connected in workspace
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Healthy
              </p>
              <p className="mt-3 text-4xl font-extrabold text-green-600">
                {summary.healthy}
              </p>
              <p className="mt-2 text-sm text-green-600">
                {Math.round((summary.healthy / Math.max(1, summary.totalRepositories)) * 100)}% of repositories
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Needs Attention
              </p>
              <p className="mt-3 text-4xl font-extrabold text-orange-500">
                {summary.needsAttention}
              </p>
              <p className="mt-2 text-sm text-orange-600">
                Requires developer action
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Total Issues
              </p>
              <p className="mt-3 text-4xl font-extrabold text-red-500">
                {summary.totalIssues}
              </p>
              <p className="mt-2 text-sm text-red-600">
                Across all repositories
              </p>
            </div>

          </div>

          {/* Search */}
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 md:flex-row">

              <div className="flex flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                <span className="mr-3 text-lg text-slate-400">
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search repositories..."
                  className="w-full bg-transparent py-3 text-sm outline-none"
                />
              </div>

              <div className="flex rounded-xl bg-slate-100 p-1">
                {["All", "Healthy", "Attention"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-lg px-5 py-2 text-sm font-bold transition ${
                      filter === item
                        ? "bg-white text-purple-600 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Repository Cards */}
          <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-2">

            {filteredRepositories.map((repo) => (
              <div
                key={repo.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white">
                      &lt;/&gt;
                    </div>

                    <div>
                      <h2 className="font-extrabold text-slate-900">
                        {repo.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {repo.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      repo.health >= 80
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {repo.status}
                  </span>

                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Language
                    </p>
                    <p className="mt-1 font-bold text-slate-800">
                      {repo.language}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Branch
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold text-slate-800">
                      {repo.branch}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Issues
                    </p>
                    <p className="mt-1 font-bold text-red-500">
                      {repo.issues}
                    </p>
                  </div>

                </div>

                <div className="mt-6">

                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-semibold text-slate-600">
                      Repository Health
                    </span>

                    <span className="text-sm font-extrabold text-slate-900">
                      {repo.health}%
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        repo.health >= 90
                          ? "bg-green-500"
                          : repo.health >= 80
                          ? "bg-blue-500"
                          : "bg-orange-500"
                      }`}
                      style={{ width: `${repo.health}%` }}
                    />
                  </div>

                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">

                  <span className="text-xs text-slate-400">
                    Updated {repo.updated}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(repo._id || repo.name)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Remove Repository"
                    >
                      ✕ Remove
                    </button>
                    <Link
                      to={`/analysis?repo=${encodeURIComponent(repo.name)}`}
                      className="rounded-lg bg-purple-50 px-4 py-2 text-xs font-bold text-purple-600 hover:bg-purple-100 transition"
                    >
                      Analyze →
                    </Link>
                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* Empty */}
          {filteredRepositories.length === 0 && (
            <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-xl font-bold text-slate-700">
                No repositories found
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Try changing your search or filter.
              </p>
            </div>
          )}

          {/* Info */}
          <div className="mt-7 rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <div className="flex gap-4">
              <div className="text-2xl">🤖</div>

              <div>
                <h3 className="font-bold text-purple-800">
                  Automatic Code Analysis
                </h3>

                <p className="mt-1 text-sm leading-6 text-purple-700">
                  Code Lens automatically analyzes connected repositories
                  whenever new changes are detected.
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Repositories;