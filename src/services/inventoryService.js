import api from "../lib/api";

// 1. Mengambil semua data
export const getInventories = async () => {
  try {
    const response = await api.get("/inventory");
    
    // Tarik data langsung ke array yang bersembunyi di lapis ketiga
    // Gunakan optional chaining (?.) agar aman jika datanya kosong/null
    const rawData = response.data?.data?.data || [];

    // Terjemahkan data untuk UI
    return rawData.map(item => ({
      ...item,
      id: item._id,                
      name: item.ingredientName,   
      price: item.unitCost,        
      minStock: item.minStock || 0 
    }));
  } catch (error) {
    console.error("Detail Error:", error);
    throw new Error(error.response?.data?.message || "Gagal mengambil data inventori");
  }
};

// 2. Mengambil data spesifik berdasarkan ID
export const getInventoryById = async (id) => {
  try {
    const response = await api.get(`/inventory/${id}`);
    const item = response.data.data || response.data;
    
    // Terjemahkan juga saat mengambil 1 data
    return {
      ...item,
      id: item._id,
      name: item.ingredientName,
      price: item.unitCost,
      minStock: item.minStock || 0
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengambil detail data");
  }
};

// 3. Menambahkan data baru
export const createInventory = async (data) => {
  try {
    const payload = {
      ingredientName: data.ingredientName,
      description: data.description,
      unit: data.unit,
      quantity: Number(data.quantity),
      unitCost: Number(data.unitCost),
      validFrom: data.validFrom,
      validTo: data.validTo,
    };

    console.log("Payload:", payload);

    const response = await api.post("/inventory", payload);

    return response.data;
  } catch (error) {
    console.error(error.response?.data);
    throw new Error(error.response?.data?.message || "Gagal menambahkan data");
  }
};

// 4. Mengubah data (Edit)
export const updateInventory = async (id, data) => {
  try {
    const payload = {
      ingredientName: data.ingredientName,
      description: data.description,
      unit: data.unit,
      quantity: Number(data.quantity),
      unitCost: Number(data.unitCost),
      validFrom: data.validFrom,
      validTo: data.validTo,
    };

    const response = await api.patch(`/inventory/${id}`, payload);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengubah data");
  }
};

// 5. Menghapus data
export const deleteInventory = async (id) => {
  try {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal menghapus data");
  }
};