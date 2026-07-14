import StatCard from "@/components/shared/StatCard"
import StockAlertCard from "@/components/shared/StockAlertCard"
import { AlertTriangle, Clock } from "lucide-react"
import SectionCard from "@/components/shared/SectionCard"
import RecentlyAddedCard from "@/components/shared/RecentlyAddedCard"

// dummy data — nanti diganti hasil fetch dari backend
const stats = [
  { label: "Total Item", value: 30 },
  { label: "Total Resep", value: 12 },
  { label: "Low Stock", value: 5, variant: "danger" },
  { label: "Total Revenue", value: "80jt" },
]

// dummy data — nanti diganti fetch dari backend, tapi bentuk field-nya disamakan dari sekarang
const lowStockItems = [
  { name: "Almond Milk", remaining: 2, total: 5, unit: "L" },
  { name: "Hazelnut Syrup", remaining: 1, total: 4, unit: " btl" },
]

const recentItems = [
  { id: 1, name: "Tapioca Pearls", category: "other", qty: 3, unit: "kg", price: 40000 },
  { id: 2, name: "Matcha Powder", category: "other", qty: 1, unit: "kg", price: 180000 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">Welcome, Tompel!</h1>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

    <div className="space-y-6">
      <SectionCard title="Low Stock Alerts" icon={AlertTriangle} iconColor="text-red-500">
        {lowStockItems.map((item) => (
            <StockAlertCard key={item.name} {...item} />
        ))}
      </SectionCard>

      <SectionCard title="Recently Added" icon={Clock} iconColor="text-orange-500">
        {recentItems.map((item) => (
            <RecentlyAddedCard key={item.id} {...item} />
        ))}
      </SectionCard>
    </div>
        </div>
  )
}



