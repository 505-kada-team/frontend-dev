import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSaleCart } from "@/hooks/useSaleCart";
import { useCreateSale } from "@/hooks/useSales";
import { DUMMY_MENUS } from "@/data/dummyMenus";
import { formatRupiah } from "@/lib/format";

export default function SaleCartForm({ onSaleCreated }) {
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    estimatedTotal,
    payload,
  } = useSaleCart();
  const { submitSale, isSubmitting, error } = useCreateSale();

  const handleAddItem = () => {
    const menu = DUMMY_MENUS.find((m) => m.id === selectedMenuId);
    const qty = Number(quantity);

    if (!menu || !Number.isInteger(qty) || qty <= 0) return;

    addItem(menu, qty);
    setSelectedMenuId("");
    setQuantity("1");
  };

  const handleCheckout = async () => {
    setSuccessMessage("");
    const result = await submitSale(payload);

    if (result.success) {
      setSuccessMessage(
        `Transaksi tercatat. Profit: ${formatRupiah(result.data.totalProfit)}`,
      );
      clearCart();
      onSaleCreated?.();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Catat Penjualan
        </h2>
        <p className="text-sm text-slate-500">
          Pilih menu, tentukan jumlah, lalu checkout
        </p>
      </div>

      {/* Form tambah item */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedMenuId}
          onChange={(e) => setSelectedMenuId(e.target.value)}
          className="flex-1 h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Pilih menu…</option>
          {DUMMY_MENUS.map((menu) => (
            <option key={menu.id} value={menu.id}>
              {menu.name} — {formatRupiah(menu.price)}
            </option>
          ))}
        </select>

        <Input
          type="number"
          min={1}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="sm:w-24"
        />

        <Button
          type="button"
          onClick={handleAddItem}
          disabled={!selectedMenuId}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-md h-9 px-4"
        >
          Tambah
        </Button>
      </div>

      {/* Tabel keranjang */}
      {cartItems.length > 0 ? (
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 uppercase">
                  Menu
                </th>
                <th className="text-center px-4 py-2 text-xs font-semibold text-slate-500 uppercase w-28">
                  Qty
                </th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500 uppercase w-32">
                  Subtotal
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cartItems.map((item) => (
                <tr key={item.menuId}>
                  <td className="px-4 py-2.5 text-slate-700">
                    {item.menuName}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={item.quantitySold}
                      onChange={(e) =>
                        updateQuantity(
                          item.menuId,
                          Math.max(1, Number(e.target.value) || 1),
                        )
                      }
                      className="h-8 text-center"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-700">
                    {formatRupiah(item.price * item.quantitySold)}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(item.menuId)}
                      className="text-slate-400 hover:text-red-500 text-xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic py-4 text-center">
          Belum ada menu di keranjang
        </p>
      )}

      {/* Estimasi total (bukan profit asli — profit sebenarnya dihitung backend) */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-400">
            Estimasi total (harga jual dummy)
          </p>
          <p className="text-lg font-semibold text-slate-900">
            {formatRupiah(estimatedTotal)}
          </p>
        </div>
        <Button
          onClick={handleCheckout}
          disabled={cartItems.length === 0 || isSubmitting}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 h-10"
        >
          {isSubmitting ? "Memproses…" : "Checkout"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
          {successMessage}
        </p>
      )}
    </div>
  );
}
