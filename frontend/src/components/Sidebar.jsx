import {
  Activity,
  BarChart3,
  Brain,
  FileText,
  Shield,
  X,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Crime Analysis",
    path: "/analysis",
    icon: Activity,
  },
  {
    name: "Predictions",
    path: "/predictions",
    icon: Brain,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("crime_ai_user");
    onClose?.();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-cyan-500/10 bg-slate-950 px-6 py-7 backdrop-blur-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >

        {/* Logo */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-3 shadow-lg shadow-cyan-500/20">
              <Shield
                size={27}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="font-bold tracking-wide text-white">
                CRIME AI
              </h1>

              <p className="text-xs text-slate-500">
                Intelligence Platform
              </p>
            </div>

          </div>

          {/* Mobile Close */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>

        </div>

        {/* Navigation */}
        <div className="mt-12">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-600">
            Command Center
          </p>

          <nav className="space-y-2">

            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                      isActive
                        ? "bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/5"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={19} />

                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                </NavLink>
              );
            })}

          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="absolute bottom-28 left-6 right-6 flex items-center gap-3 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* System */}
        <div className="absolute bottom-7 left-6 right-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-4">

          <div className="flex items-center gap-2">

            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400" />

            <span className="text-sm font-medium text-green-400">
              SYSTEM ONLINE
            </span>

          </div>

          <p className="mt-2 text-xs text-slate-500">
            AI services operational
          </p>

        </div>

      </aside>
    </>
  );
}