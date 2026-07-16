import ChangePasswordForm from "@/components/shared/ChangePasswordForm";
import {
  Sun,
  Moon,
  LogOut,
  User,
  Palette,
  ShieldCheck,
  Info,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { dark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const userName = user?.name || "User";
  const userEmail = user?.email || "-";
  const userRole = user?.role || "System Administrator";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* ================= Header ================= */}

      <div>

        <h1 className="text-3xl font-bold text-foreground">
          Settings
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage your account preferences and application settings.
        </p>

      </div>

      {/* ================= Profile ================= */}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">

          <User className="text-primary" />

          <h2 className="text-xl font-semibold">
            Profile
          </h2>

        </div>

        <div className="flex items-center gap-5">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white">
            {userInitial}
          </div>

          <div>

            <h3 className="text-xl font-semibold text-foreground">
              {userName}
            </h3>

            <p className="text-muted-foreground">
              {userEmail}
            </p>

            <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {userRole}
            </span>

          </div>

        </div>

      </div>

      {/* ================= Appearance ================= */}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">

          <Palette className="text-primary" />

          <h2 className="text-xl font-semibold">
            Appearance
          </h2>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            {dark ? (
              <Moon className="text-primary" />
            ) : (
              <Sun className="text-primary" />
            )}

            <div>

              <p className="font-medium">
                Dark Mode
              </p>

              <p className="text-sm text-muted-foreground">
                Switch between light and dark appearance.
              </p>

            </div>

          </div>

          <button
            onClick={toggleTheme}
            className={`relative h-7 w-14 rounded-full transition ${
              dark ? "bg-primary" : "bg-muted"
            }`}
          >

            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                dark ? "left-8" : "left-1"
              }`}
            />

          </button>

        </div>

      </div>

      {/* ================= Security ================= */}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">

          <ShieldCheck className="text-primary" />

          <h2 className="text-xl font-semibold">
            Security
          </h2>

        </div>

        <ChangePasswordForm />

      </div>

      {/* ================= About ================= */}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">

          <Info className="text-primary" />

          <h2 className="text-xl font-semibold">
            About
          </h2>

        </div>

        <div className="space-y-2 text-sm text-muted-foreground">

          <p>
            <strong>Application</strong> : Afternoon Coffee Time
          </p>

          <p>
            <strong>Version</strong> : v1.0.0
          </p>

          <p>
            <strong>Developer</strong> : 505 KADA Team
          </p>

        </div>

      </div>

      {/* ================= Logout ================= */}

      <div className="flex justify-end">

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </div>
  );
}