import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const revenueData = [
  { value: 18 },
  { value: 20 },
  { value: 19 },
  { value: 24 },
  { value: 23 },
  { value: 28 },
  { value: 31 },
];

export default function RevenueCard({
  value,
  trend = "+12%",
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-border
        bg-card
        p-6
        h-full
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-[3px] font-semibold text-muted-foreground">
            Revenue
          </p>

          <h2 className="mt-3 text-5xl font-bold text-foreground">
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

      <div className="mt-6 h-24">

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

      <div className="mt-5 flex items-center justify-between">

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
  );
}