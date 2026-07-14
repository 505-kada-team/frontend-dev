import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

// dummy — nanti diganti pemanggilan service, misal getInventoryById(id)
const dummyDetails = {
  1: { name: "Tapioca Pearls", category: "other", qty: 3, unit: "kg", price: 40000 },
  2: { name: "Matcha Powder", category: "other", qty: 1, unit: "kg", price: 180000 },
}

export default function InventoryDetailPage() {
  const { id } = useParams()
  const item = dummyDetails[id]

  if (!item) return <p className="text-white">Item tidak ditemukan.</p>

  return (
    <div className="space-y-4">
      <Link to="/inventories" className="flex items-center gap-2 text-slate-400 hover:text-white w-fit">
        <ArrowLeft size={18} /> Kembali
      </Link>
      <div className="bg-slate-900 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-semibold">{item.name}</h1>
        <p className="text-slate-400 mb-4">{item.category}</p>
        <p>Jumlah: {item.qty} {item.unit}</p>
        <p>Harga: Rp {item.price.toLocaleString("id-ID")}</p>
      </div>
    </div>
  )
}