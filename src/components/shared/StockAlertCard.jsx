import { Package, AlertTriangle } from "lucide-react";

export default function StockAlertCard({
  name,
  remaining,
  total,
  unit,
}) {

  const percentage = (remaining / total) * 100;

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card/70
        backdrop-blur-md
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >

      {/* Background Glow */}

      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-red-500/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">

        {/* Left */}

        <div className="flex gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">

            <Package
              className="text-red-500"
              size={22}
            />

          </div>

          <div>

            <h3 className="font-semibold text-foreground">
              {name}
            </h3>

            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">

              <AlertTriangle size={13} />

              Low Stock

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="text-right">

          <div className="rounded-lg bg-red-500/10 px-3 py-1">

            <span className="text-sm font-bold text-red-500">

              {remaining}
              {unit}

            </span>

            <span className="mx-1 text-muted-foreground">

              /

            </span>

            <span className="text-sm text-muted-foreground">

              {total}
              {unit}

            </span>

          </div>

        </div>

      </div>

      {/* Progress */}

      <div className="mt-4">

        <div className="h-2 overflow-hidden rounded-full bg-muted">

          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}