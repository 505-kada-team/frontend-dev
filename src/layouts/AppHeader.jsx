import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, Sun, Moon } from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import UserProfile from "./UserProfile";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/inventories", label: "Inventory" },
  { to: "/recipes", label: "Recipes" },
  { to: "/selling-plan", label: "Selling" },
  { to: "/settings", label: "Settings" },
];

export default function AppHeader({
  collapsed,
  toggleSidebar,
}) {
  const { dark, toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        sticky
        top-0
        z-40
        transition-all
        duration-300
        backdrop-blur-xl
        border-b
        border-border/60

        ${
          scrolled
            ? "h-14 bg-background/95 shadow-lg"
            : "h-16 bg-background/70"
        }
      `}
    >
      <div className="flex h-full items-center justify-between px-6">

        {/* Left */}

        <div className="flex items-center gap-5">

          <button
            onClick={toggleSidebar}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-border
              transition-all
              duration-300
              hover:scale-105
              hover:border-primary
              hover:bg-primary/10
              hover:text-primary
            "
          >
            <Menu size={18} />
          </button>

          {collapsed && (
            <nav className="hidden items-center gap-2 lg:flex">

              {navItems.map((item) => (

                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? "bg-primary text-white shadow-lg"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `
                  }
                >
                  {item.label}
                </NavLink>

              ))}

            </nav>
          )}

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <button
            onClick={toggleTheme}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-border
              transition-all
              duration-300
              hover:scale-105
              hover:border-primary
              hover:text-primary
            "
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <UserProfile />

        </div>

      </div>
    </header>
  );
}