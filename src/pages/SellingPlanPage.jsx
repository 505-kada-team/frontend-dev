import { useState } from "react";
import { useSalesList } from "@/hooks/useSales";
import SaleCartForm from "@/components/section/selling/SaleCartForm";
import SalesHistoryTable from "@/components/section/selling/SalesHistoryTable";
import SaleDetailDialog from "@/components/section/selling/SaleDetailDialog";

export default function SellingPlanPage() {
  const salesList = useSalesList();
  const [selectedSaleId, setSelectedSaleId] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Selling</h1>
        <p className="text-sm text-slate-600">
          Catat transaksi penjualan dan lihat riwayatnya
        </p>
      </div>

      <SaleCartForm onSaleCreated={salesList.refetch} />

      <SalesHistoryTable
        salesList={salesList}
        onSelectSale={setSelectedSaleId}
      />

      <SaleDetailDialog
        saleId={selectedSaleId}
        onClose={() => setSelectedSaleId(null)}
      />
    </div>
  );
}
