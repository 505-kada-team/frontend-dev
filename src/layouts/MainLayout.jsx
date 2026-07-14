import { Outlet, NavLink } from "react-router-dom"
import { LayoutDashboard, Package, BookOpen, Settings, TrendingUp, LogOut } from "lucide-react"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventories", label: "Inventory", icon: Package },
  { to: "/recipes", label: "Recipes", icon: BookOpen },
  { to: "/selling-plan", label: "Selling Plan", icon: TrendingUp },
  { to: "/settings", label: "Settings", icon: Settings },
]

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-slate-300 flex flex-col p-4">
        <nav className="flex-1 space-y-1 mt-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-orange-500 text-white font-medium"
                    : "hover:bg-slate-800 text-slate-300"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button className="flex items-center justify-center gap-2 border border-slate-700 rounded-lg py-2 text-red-400 hover:bg-slate-800 text-sm">
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-end items-center gap-4 bg-white border-b px-6 py-3">
          <div className="w-10 h-5 bg-slate-200 rounded-full" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <span className="text-sm font-medium">Tompel</span>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
