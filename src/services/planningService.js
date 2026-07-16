import api from "../lib/api";

// 1. Mengambil seluruh daftar planning
export const getPlannings = async () => {
  try {
    const response = await api.get("/planning");
    // Gunakan optional chaining agar aman jika datanya kosong
    return response.data?.data || [];
  } catch (error) {
    console.error("Detail Error:", error);
    throw new Error(error.response?.data?.message || "Gagal mengambil daftar planning");
  }
};

// 2. Membuat rencana produksi (Simulasi) baru
export const createPlanning = async (data) => {
  try {
    const payload = {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      menus: data.menus,
    };

    console.log("Payload Planning:", payload);

    const response = await api.post("/planning", payload);
    return response.data?.data;
  } catch (error) {
    console.error(error.response?.data);
    throw new Error(error.response?.data?.message || "Gagal membuat planning");
  }
};

// 3. Mengambil detail kalkulasi satu planning
export const getPlanningDetail = async (id) => {
  try {
    const response = await api.get(`/planning/${id}`);
    return response.data?.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengambil detail planning");
  }
};

// 4. Menghapus planning
export const deletePlanning = async (id) => {
  try {
    const response = await api.delete(`/planning/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal menghapus planning");
  }
};