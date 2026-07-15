// src/services/_helpers.js

// Buang key yang kosong/undefined supaya query string bersih,
// contoh: buildQuery({ page: 1, search: "" }) -> "?page=1"
export function buildQuery(params = {}) {
  const clean = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (clean.length === 0) return "";
  return "?" + new URLSearchParams(clean).toString();
}

// Semua response backend dibungkus { success, message, data }.
// Helper ini konsisten dipakai di semua service supaya komponen
// tidak perlu tahu bentuk envelope-nya.
export function unwrap(response) {
  return response.data.data;
}

// Untuk endpoint list yang biasanya juga punya meta pagination
// di luar "data" (sesuaikan key ini dengan response backend asli kamu).
export function unwrapList(response) {
  const body = response.data;
  return {
    items: body.data,
    meta: body.meta ?? null,
  };
}
