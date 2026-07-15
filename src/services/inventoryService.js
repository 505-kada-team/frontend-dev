// Mock Inventory Storage in memory
let mockInventories = [
  { id: 1, name: "Tapioca Pearls", quantity: 15, unit: "kg", price: 40000, minStock: 5, description: "a product" },
  { id: 2, name: "Matcha Powder", quantity: 3, unit: "kg", price: 180000, minStock: 2, description: "a product" },
  { id: 3, name: "Almond Milk", quantity: 2, unit: "L", price: 35000, minStock: 5, description: "a product" },
  { id: 4, name: "Hazelnut Syrup", quantity: 1, unit: "btl", price: 120000, minStock: 4, description: "a product" },
  { id: 5, name: "Espresso Beans", quantity: 25, unit: "kg", price: 150000, minStock: 10, description: "a product" },
  { id: 6, name: "Brown Sugar Syrup", quantity: 8, unit: "btl", price: 65000, minStock: 3, description: "a product" },
]

export const getInventories = async () => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...mockInventories]
}

export const getInventoryById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockInventories.find((item) => item.id === Number(id))
}

export const createInventory = async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  const newId = mockInventories.length > 0 ? Math.max(...mockInventories.map((i) => i.id)) + 1 : 1
  const newItem = {
    id: newId,
    name: data.name,
    quantity: Number(data.quantity),
    unit: data.unit,
    price: Number(data.price),
    minStock: Number(data.minStock || 0),
    description: data.description
  }
  mockInventories.unshift(newItem)
  return newItem
}

export const deleteInventory = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  mockInventories = mockInventories.filter((item) => item.id !== Number(id))
  return { success: true }
}

export const updateInventory = async (id, data) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const idx = mockInventories.findIndex((item) => item.id === Number(id))
  if (idx !== -1) {
    mockInventories[idx] = {
      ...mockInventories[idx],
      name: data.name,
      quantity: Number(data.quantity),
      unit: data.unit,
      price: Number(data.price),
      minStock: Number(data.minStock || 0),
      description: data.description
    }
    return mockInventories[idx]
  }
  throw new Error("Item not found")
}