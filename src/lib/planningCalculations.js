import { convertToBase, convertFromBase } from "@/lib/units"

/**
 * Hitung total kebutuhan bahan dari sekumpulan menu+kuantitas target,
 * dibandingkan stok Inventory saat ini.
 *
 * @param {Array} selectedMenus - [{ menuId, quantity }]
 * @param {Array} recipes - daftar resep, tiap resep punya ingredients: [{inventoryId, quantity, unit}]
 * @param {Array} inventories - data Inventory asli (dari useInventories)
 */
export function calculateMaterials(selectedMenus, recipes, inventories) {
  const neededByInventoryId = {}

  selectedMenus.forEach((sel) => {
    const recipe = recipes.find((r) => String(r.id) === String(sel.menuId))
    if (!recipe) return

    recipe.ingredients.forEach((ing) => {
      const neededBase = convertToBase(ing.quantity, ing.unit) * sel.quantity

      if (!neededByInventoryId[ing.inventoryId]) {
        neededByInventoryId[ing.inventoryId] = { neededBase: 0, menus: [] }
      }
      neededByInventoryId[ing.inventoryId].neededBase += neededBase
      neededByInventoryId[ing.inventoryId].menus.push({
        menuId: recipe.id,
        menuName: recipe.name,
        menuQuantity: sel.quantity,
        quantityPerMenu: ing.quantity,
        needed: ing.quantity * sel.quantity,
      })
    })
  })

  return Object.entries(neededByInventoryId).map(([inventoryId, info]) => {
    const inv = inventories.find((i) => String(i.id) === String(inventoryId))
    const unit = inv?.unit || "gr"
    const needed = Number(convertFromBase(info.neededBase, unit).toFixed(2))
    const available = inv?.quantity ?? 0
    const availableBase = convertToBase(available, unit)
    const shortageBase = Math.max(0, info.neededBase - availableBase)
    const shortage = Number(convertFromBase(shortageBase, unit).toFixed(2))

    return {
      inventoryId,
      ingredientName: inv?.name || "Bahan tidak ditemukan",
      unit,
      needed,
      available,
      shortage,
      status: shortageBase > 0 ? "KURANG" : "CUKUP",
      menus: info.menus,
    }
  })
}