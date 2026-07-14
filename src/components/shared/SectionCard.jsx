export default function SectionCard({ title, icon: Icon, iconColor = "text-white", children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
        {Icon && <Icon className={iconColor} size={20} />}
        <h2 className="text-slate-900 font-semibold text-lg">{title}</h2>
      </div>
      <div className="pt-4 space-y-3">{children}</div>
    </div>
  )
}