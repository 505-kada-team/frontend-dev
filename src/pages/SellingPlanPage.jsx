import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import Pagination from "@/components/shared/Pagination"

const ITEMS_PER_PAGE = 5

// Dummy data — nanti diganti data resep asli (dari RecipePage/backend).
// `isAvailable` sementara statis untuk slicing tampilan; nanti dihitung
// otomatis dari perbandingan kebutuhan bahan resep vs sisa stok inventory.
const dummyPlans = [
  { id: 1, name: "Americano", isAvailable: true },
  { id: 2, name: "Frappe Cappuccino", isAvailable: true },
  { id: 3, name: "Butterscotch", isAvailable: false },
  { id: 4, name: "Hazelnut Espresso", isAvailable: true },
  { id: 5, name: "Classic Milk Tea", isAvailable: true },
  { id: 6, name: "Matcha Latte", isAvailable: true },
  { id: 7, name: "Caramel Macchiato", isAvailable: false },
  { id: 8, name: "Iced Latte", isAvailable: true },
  { id: 9, name: "Hot Latte", isAvailable: true },
  { id: 10, name: "Brown Sugar Boba Latte", isAvailable: true },
  { id: 11, name: "Vanilla Sweet Cream", isAvailable: true },
  { id: 12, name: "Mocha Frappe", isAvailable: false },
]

export default function SellingPlanPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState({})     // { [id]: boolean }
  const [quantities, setQuantities] = useState({}) // { [id]: string }

  const paginatedPlans = dummyPlans.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const toggleSelect = (plan) => {
    if (!plan.isAvailable) return
    setSelected((prev) => {
      const isNowChecked = !prev[plan.id]
      if (!isNowChecked) {
        setQuantities((q) => ({ ...q, [plan.id]: "" }))
      }
      return { ...prev, [plan.id]: isNowChecked }
    })
  }

  const updateQuantity = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
    Selling Plan
  </h1>

  <p className="text-sm text-slate-600 dark:text-slate-400">
    Pilih resep yang ingin dijual dan tentukan jumlah produksinya
  </p>

  <p className="text-sm text-slate-600 dark:text-slate-400">
    Sistem akan otomatis menghitung kecukupan bahan dari inventori
  </p>
</div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Produk
              </th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                Pilih
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">
                Jumlah Produk
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedPlans.map((plan) => {
              const isChecked = !!selected[plan.id]
              const isDisabled = !plan.isAvailable

              return (
                <tr
                  key={plan.id}
                  onClick={() => toggleSelect(plan)}
                  className={`transition-colors ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50 cursor-pointer"
                  }`}
                >
                  <td className="px-5 py-4">
                    <span
                      className={`text-sm font-medium ${
                        isDisabled
                          ? "border-slate-200 text-slate-400 bg-slate-50"
                          : "border-green-200 text-slate-700 bg-green-50/50"
                      }`}
                    >
                      {plan.name}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isChecked}
                      disabled={isDisabled}
                      onCheckedChange={() => toggleSelect(plan)}
                    />
                  </td>

                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        disabled={!isChecked}
                        value={quantities[plan.id] || ""}
                        onChange={(e) => updateQuantity(plan.id, e.target.value)}
                        className="pr-10 border-green-200 text-green-700 placeholder:text-green-700 bg-green-50/50 disabled:bg-slate-50 disabled:text-slate-400 disabled:placeholder:text-slate-400 disabled:border-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        cup
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={dummyPlans.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}