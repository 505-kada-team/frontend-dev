import api from "../lib/api"

export const getInventories = async () => {
  const res = await api.get("/inventories")
  return res.data
}

export const createInventory = async (data) => {
  const res = await api.post("/inventories", data)
  return res.data
}