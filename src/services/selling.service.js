import api from "#lib/api"; // sesuaikan ke "../lib/api" kalau alias # belum dikonfigurasi di project ini

function buildSalesQueryParams({
  page,
  limit,
  search,
  sort,
  startDate,
  endDate,
} = {}) {
  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (search) params.search = search;
  if (sort) params.sort = sort;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  return params;
}

function extractErrorMessage(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

/**
 * @returns {Promise<{ data: object[], meta: object }>}
 */
export async function getSales(filters = {}) {
  try {
    const params = buildSalesQueryParams(filters);
    const response = await api.get("/sales", { params });

    return {
      data: (response.data.data ?? []).map(toSaleSummary),
      meta: toPaginationMeta(response.data.meta),
    };
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Gagal mengambil data penjualan"),
    );
  }
}

export async function getSaleById(id) {
  try {
    const response = await api.get(`/sales/${id}`);
    return toSaleDetail(response.data.data);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Gagal mengambil detail penjualan"),
    );
  }
}

/**
 * @param {{ menuId: string, quantitySold: number }[]} items
 */
export async function createSale(items) {
  const validationErrors = validateSaleItems(items);
  if (validationErrors.length > 0) {
    const err = new Error(validationErrors[0]);
    err.validationErrors = validationErrors; // full list, kalau UI mau tampilkan semua
    throw err;
  }

  try {
    const response = await api.post("/sales", { items });
    return toSaleDetail(response.data.data);
  } catch (error) {
    // 409 "Stok tidak cukup..." otomatis ke-cover di sini karena message-nya
    // sudah datang langsung dari backend lewat response.data.message
    throw new Error(extractErrorMessage(error, "Gagal mencatat penjualan"));
  }
}

////// Validation ///////////////////////////////////////////////////////////////////////
/**
 * Validasi payload item penjualan sebelum dikirim ke backend.
 * Ini validasi "fail-fast" di client agar UX lebih cepat —
 * bukan pengganti validasi backend, backend tetap source of truth.
 */
export function validateSaleItems(items) {
  const errors = [];

  if (!Array.isArray(items) || items.length === 0) {
    errors.push("Items tidak boleh kosong");
    return errors;
  }

  const seenMenuIds = new Set();

  items.forEach((item, index) => {
    if (!item.menuId || typeof item.menuId !== "string") {
      errors.push(`Item ke-${index + 1}: menuId tidak valid`);
    }
    if (!Number.isInteger(item.quantitySold) || item.quantitySold <= 0) {
      errors.push(
        `Item ke-${index + 1}: quantitySold harus bilangan bulat positif`,
      );
    }
    if (item.menuId) {
      if (seenMenuIds.has(item.menuId)) {
        errors.push(
          `menuId "${item.menuId}" duplikat, gabungkan jadi satu item`,
        );
      }
      seenMenuIds.add(item.menuId);
    }
  });

  return errors;
}

///// Mapper /////////////////////////////////////////////////////////////////////////
function toSaleItem(rawItem = {}) {
  return {
    menuId: rawItem.menuId ?? null,
    menuName: rawItem.menuName ?? "",
    quantitySold: rawItem.quantitySold ?? 0,
    sellingPriceAtSale: rawItem.sellingPriceAtSale ?? 0,
    costPriceAtSale: rawItem.costPriceAtSale ?? null,
  };
}

function toStockMovement(rawMovement = {}) {
  return {
    inventoryId: rawMovement.inventoryId ?? null,
    quantityDeducted: rawMovement.quantityDeducted ?? 0,
    quantityBefore: rawMovement.quantityBefore ?? 0,
    quantityAfter: rawMovement.quantityAfter ?? 0,
  };
}

export function toSaleSummary(rawSale = {}) {
  return {
    id: rawSale.id,
    totalProfit: rawSale.totalProfit ?? 0,
    createdAt: rawSale.createdAt,
    items: (rawSale.items ?? []).map(toSaleItem),
  };
}

export function toSaleDetail(rawSale = {}) {
  return {
    id: rawSale.id,
    totalProfit: rawSale.totalProfit ?? 0,
    createdAt: rawSale.createdAt,
    items: (rawSale.items ?? []).map(toSaleItem),
    stockMovements: (rawSale.stockMovements ?? []).map(toStockMovement),
  };
}

export function toPaginationMeta(rawMeta = {}) {
  return {
    page: rawMeta.page ?? 1,
    limit: rawMeta.limit ?? 10,
    total: rawMeta.total ?? 0,
    totalPages: rawMeta.totalPages ?? 0,
    hasNextPage: Boolean(rawMeta.hasNextPage),
    hasPrevPage: Boolean(rawMeta.hasPrevPage),
  };
}
