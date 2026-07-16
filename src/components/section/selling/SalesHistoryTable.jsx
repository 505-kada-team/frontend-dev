import { useState } from "react";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/shared/Pagination";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatRupiah, formatDate } from "@/lib/format";

export default function SalesHistoryTable({ salesList, onSelectSale }) {
  const { sales, meta, isLoading, error, updateFilters, goToPage } = salesList;

  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  // sinkronkan hasil debounce ke filter list (tidak fetch di setiap keystroke)
  useState(() => {}, []); // no-op placeholder agar linter tidak protes urutan hook di beberapa setup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useState(() => {
    updateFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  const handleDateFilter = () => {
    updateFilters({ startDate, endDate });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Riwayat Penjualan
          </h2>
          <p className="text-sm text-slate-500">
            Total {meta?.total ?? 0} transaksi
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Cari nama menu…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="sm:w-48"
          />
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="sm:w-40"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="sm:w-40"
          />
          <button
            onClick={handleDateFilter}
            className="text-sm px-3 h-9 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Terapkan
          </button>
        </div>
      </div>

      {error && <p className="px-5 py-4 text-sm text-red-600">{error}</p>}
      {isLoading && (
        <p className="px-5 py-4 text-sm text-slate-400">Memuat riwayat…</p>
      )}

      {!isLoading && sales.length === 0 && !error && (
        <p className="px-5 py-8 text-sm text-slate-400 text-center">
          Belum ada transaksi
        </p>
      )}

      {!isLoading && sales.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                Tanggal
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                Item
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                Profit
              </th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 text-slate-600">
                  {formatDate(sale.createdAt)}
                </td>
                <td className="px-5 py-3 text-slate-700">
                  {sale.items
                    .map((item) => `${item.menuName} x${item.quantitySold}`)
                    .join(", ")}
                </td>
                <td className="px-5 py-3 text-right text-green-700 font-medium">
                  {formatRupiah(sale.totalProfit)}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => onSelectSale(sale.id)}
                    className="text-xs text-orange-600 hover:underline"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {meta && meta.total > 0 && (
        <div className="px-5 py-4 border-t border-slate-100">
          <Pagination
            currentPage={meta.page}
            totalItems={meta.total}
            itemsPerPage={meta.limit}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
}
