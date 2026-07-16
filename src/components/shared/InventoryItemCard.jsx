export default function InventoryItemCard({
  ingredientName,
  unit,
  needed = 0,
  available = 0,
  shortage = 0,
  status,
  menus = [],
}) {
  const isShort = status === "KURANG" || shortage > 0;
  const percentage = needed ? Math.round((available / needed) * 100) : 100;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate font-medium text-foreground">
          {ingredientName}
        </p>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isShort
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {isShort ? "Kurang" : "Cukup"}
        </span>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        Tersedia {available} / Dibutuhkan {needed} {unit}
      </p>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${
            isShort ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {isShort && (
        <p className="mt-1 text-xs font-medium text-red-500">
          Kurang {shortage} {unit}
        </p>
      )}

      {menus.length > 0 && (
        <p className="mt-2 truncate text-xs text-muted-foreground">
          Dipakai di: {menus.map((m) => m.menuName).join(", ")}
        </p>
      )}
    </div>
  );
}