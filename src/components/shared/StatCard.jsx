export default function StatCard({ label, value, variant = "default" }) {
  const styles = {
    default: "border-slate-200",
    danger: "border-red-300 text-red-500",
  }

  return (
    <div className={`rounded-xl border bg-white p-4 flex items-center justify-between ${styles[variant]}`}>
      <span className="text-slate-500">{label}</span>
      <span className="text-3xl font-semibold text-slate-800">{value}</span>
    </div>
  )
}