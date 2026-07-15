import { useEffect, useState } from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  Settings,
  TrendingUp,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import toast from "react-hot-toast";
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
const { user, isLoading, logout } = useAuth();

if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

// Ekstrak nama dan inisial secara dinamis (fallback ke 'User' jika data belum load)
const userName = user?.name || "User";
const userInitial = userName.charAt(0).toUpperCase();

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

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 border border-border rounded-lg py-2 text-red-500 hover:bg-muted transition cursor-pointer"
        >
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
              {userInitial}
            </div>

            {/* Tampilkan Nama Dinamis */}
            <span className="text-sm font-medium text-foreground">
              {userName}
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
