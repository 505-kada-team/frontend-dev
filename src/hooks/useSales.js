import { useState, useEffect, useCallback, useRef } from "react";
import { getSales, getSaleById, createSale } from "../services/selling.service";

const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  sort: "-createdAt",
  startDate: "",
  endDate: "",
};

export function useSalesList(initialFilters = {}) {
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [sales, setSales] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // cegah race condition: kalau user ganti filter cepat-cepat,
  // hanya response dari request TERAKHIR yang boleh diterapkan ke state
  const requestIdRef = useRef(0);

  const fetchSales = useCallback(async (currentFilters) => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const result = await getSales(currentFilters);
      if (requestId === requestIdRef.current) {
        setSales(result.data);
        setMeta(result.meta);
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(err.message);
        setSales([]);
        setMeta(null);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSales(filters);
  }, [filters, fetchSales]);

  const updateFilters = useCallback((partialFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...partialFilters,
      page: partialFilters.page ?? 1, // reset ke page 1 tiap ganti filter selain page
    }));
  }, []);

  const goToPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const refetch = useCallback(() => fetchSales(filters), [fetchSales, filters]);

  return {
    sales,
    meta,
    filters,
    isLoading,
    error,
    updateFilters,
    goToPage,
    refetch,
  };
}

export function useSaleDetail(id) {
  const [sale, setSale] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  const fetchSale = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      setSale(await getSaleById(id));
    } catch (err) {
      setError(err.message);
      setSale(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSale();
  }, [fetchSale]);

  return { sale, isLoading, error, refetch: fetchSale };
}

export function useCreateSale() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitSale = useCallback(async (items) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await createSale(items);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submitSale, isSubmitting, error };
}
