// PLACEHOLDER — ganti isi fungsi ini dengan axios call ke backend
// begitu endpoint Recipe/Menu sudah kamu sambungkan.
const dummyRecipes = [
  {
    id: "1",
    name: "Brown Sugar Boba Latte",
    ingredients: [
      { inventoryId: "REPLACE_WITH_REAL_ID", quantity: 50, unit: "gr" },
      { inventoryId: "REPLACE_WITH_REAL_ID", quantity: 30, unit: "ml" },
      { inventoryId: "REPLACE_WITH_REAL_ID", quantity: 200, unit: "ml" },
    ],
    price: 25000,
  },
  {
    id: "2",
    name: "Matcha Latte",
    ingredients: [
      { inventoryId: "REPLACE_WITH_REAL_ID", quantity: 5, unit: "gr" },
      { inventoryId: "REPLACE_WITH_REAL_ID", quantity: 200, unit: "ml" },
    ],
    price: 30000,
  },
]

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export async function getRecipes() {c
  await delay()
  return dummyRecipes
}