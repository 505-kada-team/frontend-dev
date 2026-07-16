export default function MenuCapacityCard({ menuName, maximumProduction }) {
  const isUnlimited = maximumProduction === Infinity;
  const isZero = maximumProduction === 0;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <div>
        <p className="font-medium text-foreground">{menuName}</p>
        <p className="text-xs text-muted-foreground">Max production</p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-sm font-semibold ${
          isZero
            ? "bg-red-100 text-red-600"
            : isUnlimited
            ? "bg-blue-100 text-blue-600"
            : "bg-orange-100 text-orange-600"
        }`}
      >
        {isUnlimited ? "No ingredients" : `${maximumProduction} pcs`}
      </span>
    </div>
  );
}