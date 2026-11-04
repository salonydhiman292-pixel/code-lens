const API_BASE = (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[API] Error on ${endpoint}:`, err);
    return { success: false, message: err.message };
  }
}

export const authAPI = {
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  githubLogin: () =>
    request("/auth/github", {
      method: "POST",
    }),
  getMe: () => request("/auth/me"),
};

export const dashboardAPI = {
  getSummary: () => request("/dashboard/summary"),
};

export const repositoryAPI = {
  getAll: () => request("/repositories"),
  connect: (repoData) =>
    request("/repositories", {
      method: "POST",
      body: JSON.stringify(repoData),
    }),
  analyze: (repoName) =>
    request(`/repositories/${encodeURIComponent(repoName)}/analyze`, {
      method: "POST",
    }),
  delete: (repoId) =>
    request(`/repositories/${encodeURIComponent(repoId)}`, {
      method: "DELETE",
    }),
};

export const analysisAPI = {
  getAnalysis: (repo, branch) =>
    request(`/analysis?repository=${encodeURIComponent(repo || "")}&branch=${encodeURIComponent(branch || "")}`),
  runAnalysis: (repo, branch) =>
    request("/analysis/run", {
      method: "POST",
      body: JSON.stringify({ repository: repo, branch }),
    }),
};

export const riskAPI = {
  getRisk: (repo) =>
    request(`/risk?repository=${encodeURIComponent(repo || "")}`),
  runAnalysis: (repo) =>
    request("/risk/run", {
      method: "POST",
      body: JSON.stringify({ repository: repo }),
    }),
};

export const securityAPI = {
  getScan: (repo, severity) =>
    request(`/security?repository=${encodeURIComponent(repo || "")}&severity=${encodeURIComponent(severity || "")}`),
  runScan: (repo, branch) =>
    request("/security/scan", {
      method: "POST",
      body: JSON.stringify({ repository: repo, branch }),
    }),
};

export const debtAPI = {
  getDebt: () => request("/technical-debt"),
  scanDebt: () =>
    request("/technical-debt/scan", {
      method: "POST",
    }),
};

export const assistantAPI = {
  getConfig: () => request("/assistant/config"),
  getHistory: () => request("/assistant/history"),
  sendMessage: (message, repo) =>
    request("/assistant/chat", {
      method: "POST",
      body: JSON.stringify({ message, repository: repo }),
    }),
  clearHistory: () =>
    request("/assistant/history", {
      method: "DELETE",
    }),
};
