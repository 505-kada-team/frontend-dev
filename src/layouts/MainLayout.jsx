import { Outlet } from "react-router-dom";
import { useState } from "react";

import {
  LayoutDashboard,
  Package,
  BookOpen,
  TrendingUp,
  Settings,
} from "lucide-react";

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
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

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
          ${
            collapsed
              ? "ml-20"
              : "ml-64"
          }
        `}
      >

        <AppHeader
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
        />

        <main className="bg-background px-8 pb-8 pt-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}