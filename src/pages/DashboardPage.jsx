import StatCard from "@/components/shared/StatCard";
import StockAlertCard from "@/components/shared/StockAlertCard";
import RecentlyAddedCard from "@/components/shared/RecentlyAddedCard";
import SectionCard from "@/components/shared/SectionCard";
import RevenueCard from "@/components/shared/RevenueCard";

import {
  AlertTriangle,
  Clock,
  LayoutDashboard,
} from "lucide-react";

// ====================== Dummy Data ======================

const stats = [
  {
    label: "Total Item",
    value: 30,
    description: "+4 items this week",
  },
  {
    label: "Total Recipe",
    value: 12,
    description: "+2 new recipes",
  },
  {
    label: "Low Stock",
    value: 5,
    variant: "danger",
    description: "Need restock",
  },
  {
    label: "Revenue",
    value: "Rp 80 Jt",
    trend: "+12%",
  },
];

const lowStockItems = [
  {
    name: "Almond Milk",
    remaining: 2,
    total: 5,
    unit: "L",
  },
  {
    name: "Hazelnut Syrup",
    remaining: 1,
    total: 4,
    unit: "btl",
  },
];

const recentItems = [
  {
    id: 1,
    name: "Tapioca Pearls",
    category: "Other",
    qty: 3,
    unit: "kg",
    price: 40000,
  },
  {
    id: 2,
    name: "Matcha Powder",
    category: "Powder",
    qty: 1,
    unit: "kg",
    price: 180000,
  },
];

// ====================== Dashboard ======================

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* ================= Header ================= */}

      <section className="flex items-center gap-5">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-orange-500/30">
          <LayoutDashboard size={30} />
        </div>

        <div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>

          <p className="mt-1 text-base text-muted-foreground">
            Monitor inventory, stock alerts, recipes and business overview.
          </p>

        </div>

      </section>

      {/* ================= Statistics ================= */}

      <section>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((item) => (
            <StatCard
              key={item.label}
              {...item}
            />
          ))}

        </div>

      </section>

      {/* ================= Bottom Section ================= */}

      <section className="grid gap-6 xl:grid-cols-12">

        {/* Low Stock */}

        <div className="xl:col-span-5">

          <SectionCard
            title="Low Stock Alerts"
            icon={AlertTriangle}
            iconColor="text-red-500"
          >
            {lowStockItems.map((item) => (
              <StockAlertCard
                key={item.name}
                {...item}
              />
            ))}
          </SectionCard>

        </div>

        {/* Recently Added */}

        <div className="xl:col-span-7">

          <SectionCard
            title="Recently Added"
            icon={Clock}
            iconColor="text-orange-500"
          >
            {recentItems.map((item) => (
              <RecentlyAddedCard
                key={item.id}
                {...item}
              />
            ))}
          </SectionCard>

        </div>

      </section>

    </div>
  );
}