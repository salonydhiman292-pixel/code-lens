import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: "▦" },
  { name: "Repositories", path: "/repositories", icon: "◫" },
  { name: "Code Analysis", path: "/analysis", icon: "⌘" },
  { name: "Risk Prediction", path: "/risk", icon: "⚠" },
  { name: "Security", path: "/security", icon: "♢" },
  { name: "Technical Debt", path: "/technical-debt", icon: "◈" },
  { name: "AI Assistant", path: "/assistant", icon: "✦" },
];

function Sidebar({ open, setOpen }) {
  const location = useLocation();

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 font-bold text-white shadow-lg shadow-violet-200">
              C
            </div>

            <div>
              <h1 className="font-bold text-slate-900">Code Lens</h1>
              <p className="text-xs text-slate-400">
                AI Code Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="text-2xl text-slate-400 lg:hidden"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="w-5 text-center text-lg">
                  {item.icon}
                </span>

                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="m-4 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-4 text-white">
          <div className="mb-2 text-xl">✦</div>

          <p className="text-sm font-semibold">
            AI-powered insights
          </p>

          <p className="mt-1 text-xs leading-5 text-violet-100">
            Analyze your code and improve your project with AI.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;