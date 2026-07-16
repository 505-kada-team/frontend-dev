import { Outlet } from "react-router-dom";

import AuthBackground from "@/components/auth/AuthBackground";
import AuthHero from "@/components/auth/AuthHero";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1F2937]">

      <AuthBackground />

      {/* ================= Desktop ================= */}

      <div
        className="
          relative
          z-10
          hidden
          min-h-screen
          lg:grid
          lg:grid-cols-[44%_56%]
        "
      >

        {/* Left */}

        <aside
          className="
            flex
            items-center
            justify-end
            pl-20
            pr-12
          "
        >
          <div className="w-full max-w-[520px]">
            <AuthHero />
          </div>
        </aside>

        {/* Right */}

        <main
          className="
            flex
            items-center
            justify-end
            pr-24
            xl:pr-32
          "
        >
          <div className="w-full max-w-[430px]">
            <Outlet />
          </div>
        </main>

      </div>

      {/* ================= Mobile ================= */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-6
          py-10
          lg:hidden
        "
      >
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>

    </div>
  );
}