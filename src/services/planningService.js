// PLACEHOLDER — struktur data di sini sengaja dibuat SAMA PERSIS dengan
// response backend asli (statusCode, _id, dsb) supaya nanti swap ke axios
// call yang beneran tidak butuh ubah apa pun di hook/komponen pemanggilnya.
import { calculateMaterials } from "@/lib/planningCalculations"

let planningsStore = []
let nextId = 1

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export async function getPlannings() {
  await delay()
  return [...planningsStore].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}

export async function createPlanning({ name, startDate, endDate, menus }) {
  await delay()
  const newPlanning = {
    _id: String(nextId++),
    name,
    startDate,
    endDate,
    menus, // disimpan mentah, dipakai buat kalkulasi saat detail dibuka
    createdAt: new Date().toISOString(),
  }
  planningsStore.push(newPlanning)
  return newPlanning
}

export async function getPlanningDetail(id, { recipes, inventories }) {
  await delay()
  const planning = planningsStore.find((p) => p._id === id)
  if (!planning) throw new Error("Planning tidak ditemukan")

  const materials = calculateMaterials(planning.menus, recipes, inventories)

  return {
    planning: {
      id: planning._id,
      name: planning.name,
      startDate: planning.startDate,
      endDate: planning.endDate,
    },
    materials,
  }
}

export async function deletePlanning(id) {
  await delay()
  planningsStore = planningsStore.filter((p) => p._id !== id)
}