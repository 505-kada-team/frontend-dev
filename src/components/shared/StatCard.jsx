export default function StatCard({
  label,
  value,
  variant = "default",
}) {
  const styles = {
    default: "border-border",
    danger: "border-red-500 text-red-500",
  };

  return (
    <div
      className={`
        rounded-xl
        border
        bg-card
        text-card-foreground
        p-4
        flex
        items-center
        justify-between
        transition-colors
        ${styles[variant]}
      `}
    >
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="text-3xl font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}