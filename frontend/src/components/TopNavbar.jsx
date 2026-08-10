import { Bell, Menu } from "lucide-react";

export default function TopNavbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#020617]/80 px-6 py-5 backdrop-blur-xl lg:px-10">

      <div className="flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          <div>
            <p className="text-xs font-semibold tracking-widest text-cyan-400">
              AI CRIME INTELLIGENCE
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Security Command Center
            </h2>
          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <button
            className="relative rounded-xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
            aria-label="Notifications"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-400" />
          </button>

          {/* Admin */}
          <div className="hidden items-center gap-3 border-l border-white/10 pl-4 sm:flex">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 font-bold text-white">
              A
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Admin
              </p>

              <p className="text-xs text-slate-500">
                Intelligence Officer
              </p>
            </div>

          </div>

        </div>

      </div>

    </header>
  );
}