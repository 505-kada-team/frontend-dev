import { useSaleDetail } from "@/hooks/useSales";
import { formatRupiah, formatDate } from "@/lib/format";

export default function SaleDetailDialog({ saleId, onClose }) {
  const { sale, isLoading, error } = useSaleDetail(saleId);

  if (!saleId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Detail Transaksi</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm"
          >
            Tutup
          </button>
        </div>

        <div className="p-5 space-y-5">
          {isLoading && (
            <p className="text-sm text-slate-400">Memuat detail…</p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {sale && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  {formatDate(sale.createdAt)}
                </span>
                <span className="font-semibold text-green-700">
                  Profit {formatRupiah(sale.totalProfit)}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Item
                </h4>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-xs text-slate-500">
                          Menu
                        </th>
                        <th className="text-center px-3 py-2 text-xs text-slate-500">
                          Qty
                        </th>
                        <th className="text-right px-3 py-2 text-xs text-slate-500">
                          Harga Jual
                        </th>
                        <th className="text-right px-3 py-2 text-xs text-slate-500">
                          Modal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sale.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 text-slate-700">
                            {item.menuName}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {item.quantitySold}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatRupiah(item.sellingPriceAtSale)}
                          </td>
                          <td className="px-3 py-2 text-right text-slate-500">
                            {formatRupiah(item.costPriceAtSale)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {sale.stockMovements.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                    Pergerakan Stok
                  </h4>
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 text-xs text-slate-500">
                            Bahan (ID)
                          </th>
                          <th className="text-right px-3 py-2 text-xs text-slate-500">
                            Dipakai
                          </th>
                          <th className="text-right px-3 py-2 text-xs text-slate-500">
                            Sisa
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sale.stockMovements.map((m, i) => (
                          <tr key={i}>
                            <td className="px-3 py-2 text-slate-500 text-xs">
                              {m.inventoryId}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {m.quantityDeducted}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {m.quantityBefore} → {m.quantityAfter}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
