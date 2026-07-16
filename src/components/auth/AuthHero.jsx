import {
  Coffee,
  Package,
  BookOpen,
  TrendingUp,
} from "lucide-react";

import AuthFeature from "./AuthFeature";

const features = [
  {
    icon: Package,
    title: "Inventory",
  },
  {
    icon: BookOpen,
    title: "Recipes",
  },
  {
    icon: TrendingUp,
    title: "Planning",
  },
];

export default function AuthHero() {
  return (
    <section className="flex h-screen max-w-[520px] flex-col justify-center">

      {/* Logo */}

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30">

          <Coffee
            size={28}
            className="text-white"
          />

        </div>

        <div>

          <h1 className="text-3xl font-black text-white">
            Afternoon
          </h1>

          <h2 className="text-xl font-semibold text-orange-400">
            Coffee Time
          </h2>

          <p className="mt-1 text-[10px] uppercase tracking-[6px] text-slate-500">
            Inventory Management
          </p>

        </div>

      </div>

      {/* Hero */}

      <div className="mt-20">

        <h2 className="text-5xl font-black leading-none text-white">
          BREW.
        </h2>

        <h2 className="text-5xl font-black leading-none text-white">
          SERVE.
        </h2>

        <h2 className="text-5xl font-black leading-none text-orange-500">
          GROW.
        </h2>

      </div>

      {/* Description */}

      <p className="mt-8 max-w-sm text-lg leading-8 text-slate-300">

        Everything you need to manage inventory,
        recipes, production planning and sales
        performance in one dashboard.

      </p>

      {/* Features */}

      <div className="mt-12 grid grid-cols-3 gap-4">

        {features.map((item) => (

          <AuthFeature
            key={item.title}
            icon={item.icon}
            title={item.title}
          />

        ))}

      </div>

    </section>
  );
}