// src/lib/units.js
// Satu sumber kebenaran untuk kategori & konversi satuan.
// "base" adalah satuan terkecil per kategori — dipakai sebagai acuan
// saat nanti perlu hitung/kurangi stok inventory (semua dikonversi ke base dulu).

export const UNIT_CATEGORIES = {
  mass: {
    base: "gr",
    units: {
      gr: { label: "Gram (gr)", factor: 1 },
      kg: { label: "Kilogram (kg)", factor: 1000 },
    },
  },
  volume: {
    base: "ml",
    units: {
      ml: { label: "Mililiter (ml)", factor: 1 },
      L: { label: "Liter (L)", factor: 1000 },
    },
  },
  count: {
    base: "pcs",
    units: {
      pcs: { label: "Pieces (pcs)", factor: 1 },
    },
  },
}

// Cari kategori dari sebuah unit, misal getCategoryOfUnit("kg") -> "mass"
export function getCategoryOfUnit(unit) {
  return Object.keys(UNIT_CATEGORIES).find((cat) =>
    Object.keys(UNIT_CATEGORIES[cat].units).includes(unit)
  )
}

// Daftar unit yang boleh dipilih untuk sebuah inventory unit tertentu
// (unit dalam kategori yang sama saja)
export function getCompatibleUnits(inventoryUnit) {
  const category = getCategoryOfUnit(inventoryUnit)
  if (!category) return []
  return Object.entries(UNIT_CATEGORIES[category].units).map(([value, meta]) => ({
    value,
    label: meta.label,
  }))
}

// Konversi quantity dari satu unit ke base unit kategorinya
// Contoh: convertToBase(10, "gr") -> 10 (base mass = gr)
//         convertToBase(0.5, "kg") -> 500
export function convertToBase(quantity, unit) {
  const category = getCategoryOfUnit(unit)
  if (!category) return quantity
  return quantity * UNIT_CATEGORIES[category].units[unit].factor
}

// Konversi quantity dari base unit balik ke unit tujuan
// Berguna nanti kalau perlu tampilkan hasil dalam unit inventory aslinya
export function convertFromBase(baseQuantity, targetUnit) {
  const category = getCategoryOfUnit(targetUnit)
  if (!category) return baseQuantity
  return baseQuantity / UNIT_CATEGORIES[category].units[targetUnit].factor
}