// import { useInventories } from "@/hooks/useInventories"
// import { Card, CardContent } from "@/components/ui/card"

// export default function ProductsPage() {
//   const { inventories, loading, error } = useInventories()

//   if (loading) return <p className="text-center mt-10">Loading...</p>
//   if (error) return <p className="text-red-500 text-center mt-10">Failed to load data</p>

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
//       {inventories.map((p) => (
//         <Card key={p.id}>
//           <CardContent className="p-4">
//             <h3 className="font-semibold">{p.name}</h3>
//             <p className="text-slate-500">{p.quantity}{p.unit}</p>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }

export default function InventoryPage() {
  return <h1 className="text-2xl font-bold p-6">Inventory</h1>
}