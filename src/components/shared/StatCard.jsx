import {
  Package,
  BookOpen,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function StatCard({
  label,
  value,
  description,
  trend = "+12%",
  variant = "default",
  icon: IconProp,
}) {
  const styles = {
    default: {
      border: "border-border",
      value: "text-foreground",
      icon: "text-primary",
      bg: "bg-primary/10",
    },
    danger: {
      border: "border-red-500/40",
      value: "text-red-500",
      icon: "text-red-500",
      bg: "bg-red-500/10",
    },
  };

  const icons = {
    "Total Item": Package,
    "Total Recipe": BookOpen,
    "Low Stock": AlertTriangle,
  };

  const revenueData = [
    { value: 18 },
    { value: 20 },
    { value: 19 },
    { value: 24 },
    { value: 23 },
    { value: 28 },
    { value: 31 },
  ];

  const current = styles[variant];
  // Prioritaskan icon yang dikirim lewat prop. Kalau tidak ada,
  // coba cocokkan dari mapping lama berdasarkan label.
  // Fallback terakhir ke Package supaya tidak pernah undefined -> crash.
  const Icon = IconProp || icons[label] || Package;
  const isRevenue = label === "Revenue";

  // Ukuran font value menyesuaikan panjang teks, supaya angka besar
  // ("Rp 1.018.555.405") atau nama panjang ("100 kopi") tidak meluber
  // keluar kartu.
  const valueText = String(value ?? "");
  const valueSizeClass =
    valueText.length <= 6
      ? "text-5xl"
      : valueText.length <= 10
      ? "text-3xl"
      : valueText.length <= 16
      ? "text-2xl"
      : "text-lg";

  if (isRevenue) {
    return (
      <div
        className="
          h-full
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-card
          p-6
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        <div className="flex h-full flex-col">

          {/* Header */}

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[3px] text-muted-foreground">
                Revenue
              </p>

              <h2 className="mt-3 text-4xl font-bold text-foreground">
                {value}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">

              <TrendingUp
                size={22}
                className="text-primary"
              />

            </div>

          </div>

          {/* Chart */}

          <div className="mt-5 flex-1">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={revenueData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#F2754A"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

          {/* Footer */}

          <div className="mt-4 flex items-center justify-between">

            <div>

              <p className="text-lg font-bold text-green-500">
                ▲ {trend}
              </p>

              <p className="text-xs text-muted-foreground">
                this month
              </p>

            </div>

            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500">
              Growth
            </span>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        h-full
        overflow-hidden
        rounded-2xl
        border
        ${current.border}
        bg-card
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      `}
    >
      <div className="flex h-full flex-col justify-between">

        {/* Header */}

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <p className="text-xs font-semibold uppercase tracking-[3px] text-muted-foreground">
              {label}
            </p>

            <h2
              className={`mt-4 break-words ${valueSizeClass} font-bold leading-tight ${current.value}`}
            >
              {value}
            </h2>

          </div>

          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${current.bg}`}
          >

            <Icon
              size={24}
              className={current.icon}
            />

          </div>

        </div>

        {/* Divider */}

        <div className="my-5 h-px bg-border" />

        {/* Footer */}

        <p
          className={`text-sm font-medium ${
            variant === "danger"
              ? "text-red-500"
              : "text-muted-foreground"
          }`}
        >
          {description}
        </p>

      </div>
    </div>
  );
}