import { Link } from "react-router-dom"
import { Package } from "lucide-react"

export default function RecentlyAddedCard({ id, name, category, qty, unit, price }) {
  return (
    <Link
      to={`/inventories/${id}`}
      className="flex items-center justify-between p-3 rounded-xl"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-orange-900/40 flex items-center justify-center">
          <Package className="text-orange-400" size={18} />
        </div>
        <div>
          <p className="text-slate-900 font-medium">{name}</p>
          <p className="text-slate-400 text-sm">{category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-slate-900 font-medium">{qty}{unit}</p>
        <p className="text-slate-400 text-sm">Rp {price.toLocaleString("id-ID")}</p>
      </div>
    </Link>
  )
}