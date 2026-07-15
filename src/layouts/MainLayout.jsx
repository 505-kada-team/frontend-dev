import { useEffect, useState } from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  TrendingUp,
  User,
  LogOut,
  Sun,
  Moon,
  Coffee,
  Settings,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/inventories",
    label: "Inventory",
    icon: Package,
  },
  {
    to: "/recipes",
    label: "Recipes",
    icon: BookOpen,
  },
  {
    to: "/selling-plan",
    label: "Selling Plan",
    icon: TrendingUp,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function MainLayout() {
  const { dark, toggleTheme } = useTheme();
  const { user, isLoading, logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}

      <AppSidebar
        collapsed={collapsed}
        navItems={navItems}
        handleLogout={handleLogout}
      />

      {/* Content */}

      <div
        className={`
          min-h-screen
          transition-all
          duration-300
          ease-in-out
          ${collapsed ? "ml-20" : "ml-64"}
        `}
      >
        <AppHeader collapsed={collapsed} toggleSidebar={toggleSidebar} />

        <main className="bg-background px-8 pb-8 pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
