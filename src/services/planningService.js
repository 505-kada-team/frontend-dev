import api from "@/lib/api";

// ======================
// GET ALL
// ======================

export const getPlannings = async () => {
  try {
    const response = await api.get("/planning");

    // sesuaikan dengan ApiResponse backend
    return response.data.data || [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch planning data"
    );
  }
};

// ======================
// CREATE
// ======================

export const createPlanning = async (data) => {
  try {
    const payload = {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,

      menus: data.menus.map((menu) => ({
        menuId: menu.menuId,
        quantity: Number(menu.quantity),
      })),
    };

    const response = await api.post("/planning", payload);

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to create planning"
    );
  }
};

// ======================
// DETAIL
// ======================

export const getPlanningDetail = async (id) => {
  try {
    const response = await api.get(`/planning/${id}`);

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch planning detail"
    );
  }
};

// ======================
// DELETE
// ======================

export const deletePlanning = async (id) => {
  try {
    const response = await api.delete(`/planning/${id}`);

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to delete planning"
    );
  }
};