import { LogOut } from "lucide-react";

import SidebarLogo from "./SidebarLogo";
import SidebarMenu from "./SidebarMenu";

export default function AppSidebar({ collapsed, navItems, handleLogout }) {
  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        z-50
        h-screen
        overflow-hidden
        border-r
        border-sidebar-border
        bg-gradient-to-b
        from-[#242E3D]
        to-[#1B2431]
        transition-all
        duration-300
        ease-in-out
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Background Effect */}

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

      {/* Content */}

      <div className="relative flex h-full flex-col px-4 py-6">
        {/* Logo */}

        <SidebarLogo collapsed={collapsed} />

        {/* Menu */}

        <SidebarMenu navItems={navItems} collapsed={collapsed} />

        {/* Logout */}

        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : ""}
          className={`
            mt-6
            flex
            items-center
            rounded-xl
            border
            border-white/10
            bg-white/5
            py-3
            text-red-400
            transition-all
            duration-300
            hover:bg-red-500
            hover:text-white

            ${collapsed ? "justify-center" : "justify-center gap-2 px-4"}
          `}
        >
          <LogOut size={18} className="shrink-0" />

          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
