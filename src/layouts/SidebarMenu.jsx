import { NavLink } from "react-router-dom";

export default function SidebarMenu({
  navItems,
  collapsed,
}) {
  return (
    <nav className="flex-1 space-y-2">

      {navItems.map(({ to, label, icon: Icon }) => (

        <NavLink
          key={to}
          to={to}
          title={collapsed ? label : ""}
          className={({ isActive }) =>
            `
            group
            relative
            flex
            items-center
            rounded-xl
            transition-all
            duration-300

            ${
              collapsed
                ? "justify-center py-3"
                : "gap-3 px-4 py-3"
            }

            ${
              isActive
                ? `
                  bg-gradient-to-r
                  from-[#F2754A]
                  to-[#FF8D62]
                  text-white
                  shadow-lg
                  shadow-orange-500/30
                `
                : `
                  text-slate-300
                  hover:bg-white/10
                  hover:text-white
                  hover:translate-x-1
                `
            }
          `
          }
        >

          {/* Icon */}

          <Icon
            size={20}
            className="
              shrink-0
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          {/* Label */}

          <span
            className={`
              overflow-hidden
              whitespace-nowrap
              font-medium
              transition-all
              duration-300

              ${
                collapsed
                  ? "w-0 opacity-0"
                  : "w-auto opacity-100"
              }
            `}
          >
            {label}
          </span>

          {/* Tooltip */}

          {collapsed && (
            <div
              className="
                pointer-events-none
                absolute
                left-16
                rounded-lg
                bg-slate-900
                px-3
                py-2
                text-xs
                text-white
                opacity-0
                shadow-xl
                transition-all
                duration-200
                group-hover:opacity-100
              "
            >
              {label}
            </div>
          )}

        </NavLink>

      ))}

    </nav>
  );
}