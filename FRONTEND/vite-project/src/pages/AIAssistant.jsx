import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { assistantAPI } from "../services/api";

const initialSuggestions = [
  "Why is my code quality score low?",
  "Find the highest risk files",
  "Explain my security vulnerabilities",
  "How can I reduce technical debt?",
];

const initialMessages = [
  {
    role: "ai",
    text: "Hi! I'm Code Lens AI 👋\nI can analyze your codebase, explain issues, identify risks, and suggest improvements.",
  },
];

function AIAssistant() {
  const location = useLocation();
  const [input, setInput] = useState("");
  const [chat, setChat] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    assistantAPI.getConfig().then((res) => {
      if (res.success && res.suggestions) {
        setSuggestions(res.suggestions);
      }
    });

    assistantAPI.getHistory().then((res) => {
      if (res.success && res.messages?.length) {
        setChat(res.messages);
      }
    });
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const prompt = searchParams.get("prompt");
    if (prompt && prompt.trim()) {
      sendMessage(prompt.trim());
    }
  }, [location.search]);

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMessage = {
      role: "user",
      text: text.trim(),
    };

    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await assistantAPI.sendMessage(text.trim());
      if (res.success && res.aiMessage) {
        setChat((prev) => [...prev, res.aiMessage]);
      } else {
        setChat((prev) => [
          ...prev,
          {
            role: "ai",
            text: res.message || "Code Lens AI processed your request.",
          },
        ]);
      }
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Code Lens AI is currently optimizing the response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fb] text-slate-800">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">

        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-lg font-bold text-white shadow-lg shadow-violet-200">
            C
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Code Lens
            </h1>
            <p className="text-xs text-slate-400">
              AI Code Intelligence
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">

          <NavItem to="/dashboard" icon="▦" label="Dashboard" />
          <NavItem to="/repositories" icon="◫" label="Repositories" />
          <NavItem to="/analysis" icon="⌘" label="Code Analysis" />
          <NavItem to="/risk" icon="⚠" label="Risk Prediction" />
          <NavItem to="/security" icon="♢" label="Security" />
          <NavItem to="/technical-debt" icon="◈" label="Technical Debt" />

          <Link
            to="/assistant"
            className="flex items-center gap-3 rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700"
          >
            <span className="text-lg">✦</span>
            AI Assistant
          </Link>

        </nav>

        <div className="m-4 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-4 text-white">
          <div className="mb-2 text-xl">✦</div>

          <p className="text-sm font-semibold">
            AI-powered insights
          </p>

          <p className="mt-1 text-xs leading-5 text-violet-100">
            Ask questions about your codebase and get instant analysis.
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64">

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              AI Assistant
            </h2>

            <p className="text-sm text-slate-500">
              Ask questions about your codebase
            </p>
          </div>

          <div className="hidden items-center gap-3 sm:flex">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              ✦
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Code Lens AI
              </p>
              <p className="text-xs text-green-500">
                ● Online
              </p>
            </div>

          </div>
        </header>

        <div className="mx-auto max-w-6xl p-5 md:p-8">

          {/* Hero */}
          <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-6 text-white shadow-xl shadow-indigo-100 md:p-8">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>
                <div className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                  ✦ AI Code Intelligence
                </div>

                <h3 className="text-2xl font-bold md:text-3xl">
                  Your AI-powered coding assistant
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100 md:text-base">
                  Understand your codebase, identify problems, and get
                  actionable recommendations using AI-powered analysis.
                </p>
              </div>

              <div className="hidden h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-5xl backdrop-blur md:flex">
                ✦
              </div>

            </div>
          </section>

          {/* Quick Suggestions */}
          <section className="mb-6">

            <p className="mb-3 text-sm font-semibold text-slate-700">
              Quick questions
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  <span className="mb-2 block text-lg text-violet-500">
                    ✦
                  </span>

                  {suggestion}
                </button>
              ))}

            </div>
          </section>

          {/* Chat */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-xl text-white">
                  ✦
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Code Lens AI
                  </h3>

                  <p className="text-xs text-slate-400">
                    Ask anything about your project
                  </p>
                </div>

              </div>

              <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                ● Ready
              </div>

            </div>

            {/* Messages */}
            <div className="min-h-[420px] max-h-[520px] space-y-5 overflow-y-auto p-5 md:p-7">

              {chat.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-5 py-4 text-sm leading-6 md:max-w-[70%] ${
                      message.role === "user"
                        ? "rounded-br-md bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                        : "rounded-bl-md bg-slate-50 text-slate-700"
                    }`}
                  >
                    {message.text}
                  </div>

                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-slate-50 px-5 py-4">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Input */}
            <div className="border-t border-slate-100 p-4 md:p-5">

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-violet-400 focus-within:bg-white">

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder="Ask Code Lens AI about your code..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />

                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-lg text-white shadow-lg shadow-violet-200 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↑
                </button>

              </div>

              <p className="mt-2 text-center text-[11px] text-slate-400">
                AI responses are generated from your latest Code Lens analysis.
              </p>

            </div>

          </section>

          {/* Bottom Stats */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <InfoCard
              icon="⌘"
              title="Code Analysis"
              value="86%"
              text="Current quality score"
            />

            <InfoCard
              icon="⚠"
              title="Risk Prediction"
              value="68/100"
              text="Overall project risk"
            />

            <InfoCard
              icon="♢"
              title="Security"
              value="88%"
              text="Current security score"
            />

          </div>

        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );
}

function InfoCard({ icon, title, value, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg text-violet-600">
          {icon}
        </div>

        <span className="text-xl font-bold text-slate-900">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {text}
      </p>

    </div>
  );
}

export default AIAssistant;