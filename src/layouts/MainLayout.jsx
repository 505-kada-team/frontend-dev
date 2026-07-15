import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  Settings,
  TrendingUp,
  LogOut,
  Sun,
  Moon,
  Coffee,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventories", label: "Inventory", icon: Package },
  { to: "/recipes", label: "Recipes", icon: BookOpen },
  { to: "/selling-plan", label: "Selling Plan", icon: TrendingUp },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function MainLayout() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* ================= SIDEBAR ================= */}

      <aside className="relative w-64 overflow-hidden border-r border-sidebar-border bg-gradient-to-b from-[#242E3D] to-[#1B2431]">

        {/* Background */}

        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

        </div>

        <div className="relative flex h-full flex-col p-6">

          {/* Logo */}

          <div className="mb-12">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-orange-500/30">

                <Coffee size={24} />

              </div>

              <div>

                <h1 className="text-xl font-bold text-white">
                  Afternoon
                </h1>

                <h2 className="text-lg font-semibold text-primary">
                  Coffee Time
                </h2>

              </div>

            </div>

            <p className="mt-3 text-xs uppercase tracking-[3px] text-slate-400">
              Inventory Management
            </p>

          </div>

          {/* Menu */}

          <nav className="flex-1 space-y-2">

            {navItems.map(({ to, label, icon: Icon }) => (

              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#F2754A] to-[#FF8D62] text-white shadow-lg shadow-orange-500/40"
                      : "text-slate-300 hover:bg-white/10 hover:text-white hover:translate-x-1"
                  }`
                }
              >

                <Icon
                  size={19}
                  className="transition-transform group-hover:scale-110"
                />

                <span className="font-medium">
                  {label}
                </span>

              </NavLink>

            ))}

          </nav>

          {/* Logout */}

          <button className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-red-400 transition hover:bg-red-500 hover:text-white">

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>

      {/* ================= CONTENT ================= */}

      <div className="flex flex-1 flex-col">

        {/* HEADER */}

        <header className="sticky top-0 z-50 flex items-center justify-end border-b border-border bg-card/80 px-8 py-4 backdrop-blur-xl">

          <div className="flex items-center gap-4">

            {/* Theme */}

            <button
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-all hover:scale-105 hover:border-primary hover:text-primary"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin */}

            <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                A
              </div>

              <div>

                <p className="text-sm font-semibold text-foreground">
                  Admin
                </p>

                <p className="text-xs text-muted-foreground">
                  admin@afternooncoffee.com
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* PAGE */}

        <main className="flex-1 bg-background p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}