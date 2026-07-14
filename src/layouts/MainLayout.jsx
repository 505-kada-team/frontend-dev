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
} from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventories", label: "Inventory", icon: Package },
  { to: "/recipes", label: "Recipes", icon: BookOpen },
  { to: "/selling-plan", label: "Selling Plan", icon: TrendingUp },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function MainLayout() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;

    setDark(next);

    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors">
      {/* Sidebar */}
      <aside className="w-56 bg-sidebar border-r border-sidebar-border text-sidebar-foreground flex flex-col p-4 transition-colors">
        <nav className="flex-1 space-y-1 mt-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-orange-500 text-white font-medium"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button className="flex items-center justify-center gap-2 border border-border rounded-lg py-2 text-red-500 hover:bg-muted transition">
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col bg-background transition-colors">
        {/* Header */}
        <header className="flex justify-end items-center gap-4 bg-card border-b border-border px-6 py-3 transition-colors">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition"
          >
            {dark ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
              T
            </div>

            <span className="text-sm font-medium text-foreground">
              Tompel
            </span>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 p-6 bg-background transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}