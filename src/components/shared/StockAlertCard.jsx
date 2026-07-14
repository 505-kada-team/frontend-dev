import { Package } from 'lucide-react';

export default function StockAlertCard({ name, remaining, total, unit }) {
  return (
    <div className="flex items-center justify-between rounded-xl p-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-red-900 flex items-center justify-center">
          <Package className="text-red-400" size={18} />
        </div>
        <div className="">
          <p className="text-slate-900 font-medium">{name}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-red-600 text-sm font-bold">
          {remaining}
          {unit} <span className="text-slate-700 font-light">/</span><span className="text-slate-700"> {total}
          {unit}</span>
        </p>
      </div>
    </div>
  );
}
