import { Coffee } from "lucide-react";

export default function SidebarLogo({ collapsed }) {
  return (
    <div
      className={`mb-10 transition-all duration-300 ${
        collapsed ? "flex justify-center" : ""
      }`}
    >
      <div
        className={`flex items-center transition-all duration-300 ${
          collapsed ? "justify-center" : "gap-3"
        }`}
      >
        {/* Logo */}
        <div
          className="
            flex h-12 w-12 shrink-0 items-center justify-center
            rounded-xl
            bg-gradient-to-br
            from-orange-400
            to-orange-600
            text-white
            shadow-lg
            shadow-orange-500/30
          "
        >
          <Coffee size={24} />
        </div>

        {/* Title */}
        <div
          className={`
            overflow-hidden
            transition-all
            duration-300
            ${
              collapsed
                ? "w-0 opacity-0"
                : "w-36 opacity-100"
            }
          `}
        >
          <h1 className="whitespace-nowrap text-xl font-bold text-white">
            Afternoon
          </h1>

          <h2 className="whitespace-nowrap text-lg font-semibold text-primary">
            Coffee Time
          </h2>
        </div>
      </div>

      {/* Subtitle */}
      <p
        className={`
          mt-3
          overflow-hidden
          whitespace-nowrap
          text-xs
          uppercase
          tracking-[3px]
          text-slate-400
          transition-all
          duration-300
          ${
            collapsed
              ? "max-h-0 opacity-0"
              : "max-h-10 opacity-100"
          }
        `}
      >
        Inventory Management
      </p>
    </div>
  );
}