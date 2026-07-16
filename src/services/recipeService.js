import api from "@/lib/api"

export async function getRecipes({ page = 1, limit = 100, search = "" } = {}) {
  const res = await api.get("/menu", { params: { page, limit, search } })
  return res.data?.data?.data || []
}

export async function getRecipeDetail(id) {
  const res = await api.get(`/menu/${id}`)
  return res.data.data
}

export async function createRecipe(payload) {
  const res = await api.post("/menu", payload)
  return res.data.data
}

export async function updateRecipe(id, payload) {
  const res = await api.put(`/menu/${id}`, payload)
  return res.data.data
}

export async function deleteRecipe(id) {
  const res = await api.delete(`/menu/${id}`)
  return res.data
}