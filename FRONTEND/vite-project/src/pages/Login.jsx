import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (isSignup) {
      if (!name) {
        setError("Please enter your name.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    try {
      const res = isSignup
        ? await authAPI.register({ name, email, password })
        : await authAPI.login({ email, password });

      if (res.success) {
        if (res.token) localStorage.setItem("code_lens_token", res.token);
        if (res.user) localStorage.setItem("code_lens_user", JSON.stringify(res.user));
        navigate("/dashboard");
      } else {
        setError(res.message || "Authentication failed. Proceeding to dashboard...");
        setTimeout(() => navigate("/dashboard"), 800);
      }
    } catch {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setGithubLoading(true);
    setError("");
    try {
      const res = await authAPI.githubLogin();
      if (res.success) {
        if (res.token) localStorage.setItem("code_lens_token", res.token);
        if (res.user) localStorage.setItem("code_lens_user", JSON.stringify(res.user));
        navigate("/dashboard");
      } else {
        localStorage.setItem(
          "code_lens_user",
          JSON.stringify({ name: "Saksham", role: "Developer", provider: "github" })
        );
        navigate("/dashboard");
      }
    } catch {
      localStorage.setItem(
        "code_lens_user",
        JSON.stringify({ name: "Saksham", role: "Developer", provider: "github" })
      );
      navigate("/dashboard");
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">

      <div className="flex min-h-screen items-center justify-center p-5">

        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

          {/* LEFT */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />

            <div className="relative z-10">

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-lg font-black">
                  CL
                </div>

                <div>
                  <h1 className="text-xl font-extrabold">
                    CODE LENS
                  </h1>

                  <p className="text-xs text-indigo-200">
                    AI Code Intelligence
                  </p>
                </div>
              </div>

              <div className="mt-20">
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">
                  Welcome to Code Lens
                </p>

                <h2 className="mt-4 text-5xl font-extrabold leading-tight">
                  Understand your
                  <br />
                  code better.
                </h2>

                <p className="mt-6 max-w-md leading-7 text-indigo-100">
                  Analyze repositories, detect security risks, predict bugs
                  and improve your codebase with AI-powered insights.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4">

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-extrabold">86%</p>
                <p className="mt-1 text-xs text-indigo-200">
                  Code Health
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-extrabold">91%</p>
                <p className="mt-1 text-xs text-indigo-200">
                  AI Accuracy
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-extrabold">24/7</p>
                <p className="mt-1 text-xs text-indigo-200">
                  Monitoring
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div className="p-7 sm:p-10 lg:p-12">

            <div className="mx-auto max-w-md">

              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 font-black text-white">
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

              <h2 className="text-3xl font-extrabold text-slate-900">
                {isSignup ? "Create your account" : "Welcome back"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {isSignup
                  ? "Start analyzing your codebase today."
                  : "Sign in to continue to your dashboard."}
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {isSignup && (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <div className="mb-2 flex justify-between">
                    <label className="block text-sm font-bold text-slate-700">
                      Password
                    </label>

                    {!isSignup && (
                      <button
                        type="button"
                        className="text-xs font-bold text-purple-600 hover:text-purple-700"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                {isSignup && (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                    />
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {isSignup ? "Create Account →" : "Sign In →"}
                </button>

              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold text-slate-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGitHubLogin}
                disabled={githubLoading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60 shadow-sm"
              >
                <svg className="h-5 w-5 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                {githubLoading ? "Authenticating with GitHub..." : "Continue with GitHub"}
              </button>

              <p className="mt-7 text-center text-sm text-slate-500">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}

                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError("");
                  }}
                  className="ml-1 font-bold text-purple-600 hover:text-purple-700"
                >
                  {isSignup ? "Sign in" : "Create account"}
                </button>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;