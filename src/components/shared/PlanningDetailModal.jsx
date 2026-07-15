import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ChevronDown, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getPlanningDetail, deletePlanning } from "@/services/planningService"

export default function PlanningDetailModal({ planningId, open, onOpenChange, recipes, inventories, onDeleted }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!planningId) return
    setLoading(true)
    getPlanningDetail(planningId, { recipes, inventories })
      .then(setDetail)
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false))
  }, [planningId, recipes, inventories])

  const handleDelete = async () => {
    if (!planningId) return
    await deletePlanning(planningId)
    setConfirmDelete(false)
    if (onDeleted) onDeleted()
  }

  return (
    <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg bg-white border border-slate-200 shadow-xl rounded-4xl max-h-[85vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
              <Loader2 className="size-4 animate-spin" /> Loading detail...
            </div>
          ) : detail ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  {detail.planning.name}
                </DialogTitle>
                <p className="text-xs text-slate-400">
                  {format(new Date(detail.planning.startDate), "dd MMM yyyy")} —{" "}
                  {format(new Date(detail.planning.endDate), "dd MMM yyyy")}
                </p>
              </DialogHeader>

              <div className="space-y-2 pt-2">
                {detail.materials.map((m) => {
                  const isExpanded = expandedId === m.inventoryId
                  const isShort = m.status === "KURANG"

                  return (
                    <div
                      key={m.inventoryId}
                      className={`rounded-xl border overflow-hidden ${
                        isShort ? "border-red-200 bg-red-50/40" : "border-emerald-200 bg-emerald-50/40"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : m.inventoryId)}
                        className="w-full flex items-center justify-between p-3 cursor-pointer"
                      >
                        <div className="text-left">
                          <p className="font-medium text-slate-800">{m.ingredientName}</p>
                          <p className={`text-xs ${isShort ? "text-red-500" : "text-emerald-600"}`}>
                            Butuh {m.needed}{m.unit} — Tersedia {m.available}{m.unit}
                            {isShort && ` (kurang ${m.shortage}${m.unit})`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              isShort ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                            }`}
                          >
                            {m.status}
                          </span>
                          <ChevronDown
                            className={`size-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-white p-3 space-y-1.5">
                          {m.menus.map((menu, i) => (
                            <div key={i} className="flex justify-between text-xs text-slate-500">
                              <span>{menu.menuName} × {menu.menuQuantity}</span>
                              <span>{menu.needed}{m.unit}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <AlertDialogTrigger
                  render={
                    <Button variant="ghost" className="rounded-full cursor-pointer text-red-500 hover:bg-red-50">
                      <Trash2 className="size-3.5 mr-1.5" /> Hapus Simulasi
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  className="rounded-full cursor-pointer"
                  onClick={() => onOpenChange(false)}
                >
                  Tutup
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-50 text-red-500">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-slate-900 font-bold">Hapus simulasi ini?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            Riwayat simulasi ini akan dihapus permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" className="rounded-full cursor-pointer">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="rounded-full cursor-pointer bg-red-500 hover:bg-red-600 text-white">
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}