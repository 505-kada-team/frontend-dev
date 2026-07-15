// src/services/menu.service.js
import api from "#lib/api";
import { buildQuery, unwrapList, unwrap } from "./_helpers";
import { toMenuModel, toMenuListModel } from "#models/menu.model";

export function getAllMenu({
  page = 1,
  limit = 10,
  search = "",
  sort = "",
} = {}) {
  const query = buildQuery({ page, limit, search, sort });
  return api.get(`/menu${query}`).then((res) => {
    const { items, meta } = unwrapList(res);
    return { items: toMenuListModel(items), meta };
  });
}

export function createMenu(payload) {
  // payload: { name, description, sellingPrice, ingredients: [{ inventoryId, quantityNeeded }] }
  return api.post("/menu", payload).then(unwrap).then(toMenuModel);
}

export function getMenuById(id) {
  return api.get(`/menu/${id}`).then(unwrap).then(toMenuModel);
}

export function updateMenu(id, payload) {
  return api.put(`/menu/${id}`, payload).then(unwrap).then(toMenuModel);
}

export function deleteMenu(id) {
  return api.delete(`/menu/${id}`).then(unwrap);
}
