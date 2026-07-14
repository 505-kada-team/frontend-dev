import { Package } from "lucide-react";

export default function StockAlertCard({
  name,
  remaining,
  total,
  unit,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
          <Package className="text-red-600 dark:text-red-400" size={18} />
        </div>

        <div>
          <p className="font-medium text-foreground">
            {name}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-red-600 dark:text-red-400">
          {remaining}
          {unit}

          <span className="mx-1 font-light text-muted-foreground">
            /
          </span>

          <span className="text-muted-foreground">
            {total}
            {unit}
          </span>
        </p>
      </div>
    </div>
  );
}