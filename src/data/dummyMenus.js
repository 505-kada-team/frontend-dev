// TODO: ganti dengan hasil GET /menu?available=true saat endpoint tersebut sudah siap.
// id di sini HARUS sama persis dengan _id menu asli di database,
// kalau tidak POST /sales akan balas 400 "menuId tidak valid".
export const DUMMY_MENUS = [
  { id: "6a5800d50a53af81e0c85735", name: "Black Tea Atrhopic", price: 250000 },
  { id: "66f2a2b3c4d5e6f7a8b9c0d3", name: "Frappe Cappuccino", price: 22000 },
  { id: "66f2a2b3c4d5e6f7a8b9c0d4", name: "Butterscotch", price: 24000 },
  { id: "66f2a2b3c4d5e6f7a8b9c0d5", name: "Hazelnut Espresso", price: 20000 },
  { id: "66f2a2b3c4d5e6f7a8b9c0d6", name: "Classic Milk Tea", price: 19000 },
  { id: "66f2a2b3c4d5e6f7a8b9c0d7", name: "Matcha Latte", price: 23000 },
  { id: "66f2a2b3c4d5e6f7a8b9c0d8", name: "Iced Latte", price: 21000 },
];
