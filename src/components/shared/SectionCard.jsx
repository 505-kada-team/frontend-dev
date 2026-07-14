export default function SectionCard({
  title,
  icon: Icon,
  iconColor = "text-primary",
  children,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card text-card-foreground p-5 shadow-sm transition-colors">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        {Icon && <Icon className={iconColor} size={20} />}
        <h2 className="text-lg font-semibold text-foreground">
          {title}
        </h2>
      </div>

      <div className="space-y-3 pt-4">
        {children}
      </div>
    </div>
  );
}