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
  Coffee,
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
    toast.success("Logged out successfully");
  };

  // Ekstrak nama dan inisial secara dinamis (fallback ke 'User' jika data belum load)
  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="relative w-64 overflow-hidden border-r border-sidebar-border bg-gradient-to-b from-[#242E3D] to-[#1B2431]">
        
        {/* Background Effects */}
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
          
          {/* Logo & User Info */}
          <div className="mb-10">
            {/* Bagian Brand */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-orange-500/30">
                <Coffee size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Afternoon</h1>
                <h2 className="text-lg font-semibold text-primary">Coffee Time</h2>
              </div>
            </div>

            {/* Bagian Profil Dinamis (Dari Merge Conflict) */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                {userInitial}
              </div>
              <span className="text-sm font-medium text-white">
                {userName}
              </span>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[3px] text-slate-400">
              Inventory Management
            </p>
          </div>

          {/* Menu Navigasi */}
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
                <Icon size={19} className="transition-transform group-hover:scale-110" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Tombol Logout Sidebar */}
          <button 
            onClick={handleLogout}
            className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-red-400 transition hover:bg-red-500 hover:text-white cursor-pointer"
          >
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
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-all hover:scale-105 hover:border-primary hover:text-primary cursor-pointer"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin Profile (Sudah Dinamis) */}
            <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                {userInitial}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "user@afternooncoffee.com"}
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