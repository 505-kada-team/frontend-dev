import { Link } from 'react-router-dom';
import { Package, ArrowUpRight } from 'lucide-react';

export default function RecentlyAddedCard({ id, name, category, qty, unit, price }) {
  return (
    <Link
      to={`/inventories/${id}`}
      className="
        group
        relative
        overflow-hidden
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-border
        bg-card/70
        backdrop-blur-md
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary
        hover:shadow-lg
      "
    >
      {/* Glow */}

      <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Package size={22} className="text-primary" />
        </div>

        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>

          <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{category}</span>
        </div>
      </div>

      <div className="relative flex items-center gap-5">
        <div className="text-right">
          <p className="font-bold text-foreground">
            {qty}
            {unit}
          </p>

          <p className="text-sm text-muted-foreground">Rp {price.toLocaleString('id-ID')}</p>
        </div>

        <ArrowUpRight size={18} className="text-muted-foreground transition group-hover:text-primary" />
      </div>
    </Link>
  );
}
