export function formatRupiah(value) {
  return `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;
}

export function formatDate(isoString) {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
