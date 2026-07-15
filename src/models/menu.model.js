// src/models/menu.model.js
//
// Contoh pola "model" tanpa TypeScript: fungsi murni yang menormalkan
// bentuk response backend menjadi shape yang stabil untuk dipakai UI.
// Kalau backend ganti nama field, cukup ubah di sini saja.

/**
 * @typedef {Object} MenuIngredient
 * @property {string} inventoryId
 * @property {number} quantityNeeded
 */

/**
 * @typedef {Object} Menu
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} sellingPrice
 * @property {MenuIngredient[]} ingredients
 */

/** @param {any} raw - object mentah dari backend @returns {Menu} */
export function toMenuModel(raw) {
  return {
    id: raw._id ?? raw.id,
    name: raw.name,
    description: raw.description ?? "",
    sellingPrice: Number(raw.sellingPrice ?? 0),
    ingredients: (raw.ingredients ?? []).map((i) => ({
      inventoryId: i.inventoryId?._id ?? i.inventoryId,
      quantityNeeded: Number(i.quantityNeeded ?? 0),
    })),
  };
}

export function toMenuListModel(rawList) {
  return (rawList ?? []).map(toMenuModel);
}
