import { useState, useEffect } from "react";
import { Sun, Moon, LogOut } from "lucide-react";

export default function SettingsPage() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";

    if (isDark) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !dark;

    setDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const user = {
    name: "Admin",
    email: "admin@afternooncoffee.com",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your app preferences
        </p>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          Appearance
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {dark ? (
              <Moon className="w-5 h-5 text-orange-500" />
            ) : (
              <Sun className="w-5 h-5 text-orange-500" />
            )}

            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Dark Mode
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle dark mode theme
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              dark ? "bg-orange-500" : "bg-gray-300 dark:bg-slate-600"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                dark ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          Profile
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-2xl font-bold text-white">
            {user.name.charAt(0)}
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.name}
            </p>

            <p className="text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          Account
        </h2>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* About */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
          About
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Afternoon Coffee Time v1.0.0
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Inventory Management System
        </p>
      </div>
    </div>
  );
}