import { useEffect, useMemo, useState } from "react";
import api from "#lib/api";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/shared/StatCard";
import SectionCard from "@/components/shared/SectionCard";
import MenuCapacityCard from "@/components/shared/MenuCapacityCard";
import InventoryItemCard from "@/components/shared/InventoryItemCard";

import {
  AlertTriangle,
  CalendarClock,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  PackageSearch,
  Wallet,
} from "lucide-react";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function isLowStock(item) {
  return item.status === "KURANG" || (item.shortage ?? 0) > 0;
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [data, setData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tunggu AuthContext selesai restore session (F5) dulu, dan jangan
    // fetch kalau belum login. Tidak ada setState langsung di body effect
    // untuk kasus ini -> status loading dihitung lewat variabel derived
    // di bawah, supaya tidak memicu cascading render.
    if (isAuthLoading || !isAuthenticated) return;

    async function fetchSummary() {
      try {
        setIsFetching(true);
        setError(null);

        const res = await api.get("/dashboard/summary");
        const payload = res.data.data ?? res.data;

        // Backend lama (belum di-redeploy) masih mengembalikan
        // { activePlanning, menuCapacity, remainingInventory, totalProfit }
        // alih-alih { plannings: [...], totalProfit }.
        // Normalisasi di sini supaya UI tetap jalan di kedua kondisi,
        // dan kelihatan jelas kalau backend belum sinkron.
        let normalized;
        if (Array.isArray(payload?.plannings)) {
          normalized = payload;
        } else if (payload?.activePlanning) {
          normalized = {
            totalProfit: payload.totalProfit ?? 0,
            plannings: [
              {
                id: payload.activePlanning.id,
                planningName: payload.activePlanning.planningName,
                menuCapacity: payload.menuCapacity ?? [],
                remainingInventory: payload.remainingInventory ?? [],
              },
            ],
          };
        } else {
          normalized = { totalProfit: payload?.totalProfit ?? 0, plannings: [] };
        }

        setData(normalized);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Gagal memuat data dashboard";
        setError(message);
      } finally {
        setIsFetching(false);
      }
    }

    fetchSummary();
  }, [isAuthLoading, isAuthenticated]);

  // Loading gabungan diturunkan (derived) dari beberapa state yang sudah
  // ada, bukan disimpan sebagai state terpisah yang di-set manual di
  // dalam effect. Ini yang menghilangkan warning
  // react-hooks/set-state-in-effect sekaligus menghindari cascading render.
  const loading =
    isAuthLoading || (isAuthenticated && isFetching && !data && !error);

  const plannings = data?.plannings ?? [];
  const totalProfit = data?.totalProfit ?? 0;

  // Ringkasan gabungan lintas semua planning, untuk stat cards di atas.
  const overallLowStockCount = useMemo(() => {
    return plannings.reduce((count, planning) => {
      const items = planning.remainingInventory ?? [];
      return count + items.filter(isLowStock).length;
    }, 0);
  }, [plannings]);

  const totalMenusAcrossPlannings = useMemo(() => {
    return plannings.reduce(
      (sum, planning) => sum + (planning.menuCapacity?.length ?? 0),
      0
    );
  }, [plannings]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Silakan login untuk melihat dashboard.
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const hasPlannings = plannings.length > 0;

  const stats = [
    {
      label: "Total Planning",
      value: plannings.length,
      description: hasPlannings
        ? `${totalMenusAcrossPlannings} menu tercatat`
        : "Belum ada planning",
      variant: hasPlannings ? undefined : "danger",
      icon: ClipboardList,
    },
    {
      label: "Total Profit",
      value: formatRupiah(totalProfit),
      icon: Wallet,
    },
    {
      label: "Menus in Planning",
      value: totalMenusAcrossPlannings,
      description: "Total dari semua planning",
      icon: ChefHat,
    },
    {
      label: "Low Stock",
      value: overallLowStockCount,
      variant: overallLowStockCount > 0 ? "danger" : undefined,
      description:
        overallLowStockCount > 0
          ? "Need restock (semua planning)"
          : "All good",
      icon: AlertTriangle,
    },
  ];

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
            Monitor semua planning, kapasitas produksi, dan sisa inventori.
          </p>
        </div>
      </section>

      {/* ================= Belum ada planning ================= */}
      {!hasPlannings && (
        <section className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/30 p-8 text-center">
          <ClipboardList
            className="mx-auto mb-3 text-muted-foreground"
            size={32}
          />
          <h2 className="text-lg font-semibold text-foreground">
            Belum ada planning
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Buat planning baru untuk melihat kapasitas produksi dan
            pemakaian inventori di sini.
          </p>
        </section>
      )}

      {/* ================= Statistics ================= */}
      <section>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>
      </section>

      {hasPlannings && (
        <div className="space-y-8">
          {plannings.map((planning) => {
            const menuCapacity = planning.menuCapacity ?? [];
            const remainingInventory = planning.remainingInventory ?? [];
            const lowStockItems = remainingInventory.filter(isLowStock);
            const capacityTotal = menuCapacity.reduce((sum, m) => {
              return m.maximumProduction === Infinity
                ? sum
                : sum + m.maximumProduction;
            }, 0);

            return (
              <section
                key={planning.id}
                className="rounded-2xl border border-border bg-card/50 p-5"
              >
                {/* Header per planning */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarClock size={18} className="text-primary" />
                    <h2 className="text-lg font-bold text-foreground">
                      {planning.planningName}
                    </h2>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {menuCapacity.length} menu &middot; {capacityTotal} porsi
                    max
                  </span>
                </div>

                {/* Low Stock + Menu Capacity */}
                <div className="grid gap-6 xl:grid-cols-12">
                  <div className="xl:col-span-5">
                    <SectionCard
                      title="Low Stock Alerts"
                      icon={AlertTriangle}
                      iconColor="text-red-500"
                    >
                      {lowStockItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Tidak ada item yang menipis di planning ini.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {lowStockItems.map((item) => (
                            <InventoryItemCard
                              key={item.inventoryId || item.ingredientName}
                              {...item}
                            />
                          ))}
                        </div>
                      )}
                    </SectionCard>
                  </div>

                  <div className="xl:col-span-7">
                    <SectionCard
                      title="Menu Production Capacity"
                      icon={ChefHat}
                      iconColor="text-orange-500"
                    >
                      {menuCapacity.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Tidak ada menu di planning ini.
                        </p>
                      ) : (
                        menuCapacity.map((item) => (
                          <MenuCapacityCard key={item.menuId} {...item} />
                        ))
                      )}
                    </SectionCard>
                  </div>
                </div>

                {/* Remaining Inventory (full list) */}
                <div className="mt-6">
                  <SectionCard
                    title="Remaining Inventory After Planning"
                    icon={PackageSearch}
                    iconColor="text-blue-500"
                  >
                    {remainingInventory.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Tidak ada data inventori untuk planning ini.
                      </p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {remainingInventory.map((item) => (
                          <InventoryItemCard
                            key={item.inventoryId || item.ingredientName}
                            {...item}
                          />
                        ))}
                      </div>
                    )}
                  </SectionCard>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}