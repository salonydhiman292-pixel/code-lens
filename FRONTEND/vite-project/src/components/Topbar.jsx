function Topbar({ title, subtitle, onMenuClick }) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("code_lens_user")) || {};
    } catch {
      return {};
    }
  })();

  const userName = user.name || "Developer";
  const userRole = user.role || "Developer";
  const initial = userName.charAt(0).toUpperCase() || "D";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-lg text-slate-600 hover:bg-slate-50 lg:hidden"
        >
          ☰
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-900 md:text-xl">
            {title}
          </h2>

          <p className="hidden text-sm text-slate-500 sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 md:flex">
          <span className="text-slate-400">⌕</span>

          <input
            placeholder="Search..."
            className="w-28 bg-transparent text-sm outline-none placeholder:text-slate-400 lg:w-36"
          />
        </div>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
          ♧
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500" />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 md:gap-3 md:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-semibold text-white">
            {initial}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {userName}
            </p>

            <p className="text-xs text-slate-400">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;