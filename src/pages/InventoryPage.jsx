import { useState } from 'react';
import { useInventories } from '@/hooks/useInventory';
import { deleteInventory } from '@/services/inventoryService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import InventoryForm from '@/components/shared/InventoryForm';
import PlanningModal from '@/components/shared/PlanningModal';
import { ClipboardList } from 'lucide-react';
import { Search, Plus, Edit2, Trash2, AlertTriangle, RefreshCw, Info } from 'lucide-react';

export default function InventoryPage() {
  const { inventories, loading, error, refetch } = useInventories();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlanningOpen, setIsPlanningOpen] = useState(false);

  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null); // holds ID of item being deleted
  const [deleteTargetId, setDeleteTargetId] = useState(null); // item pending confirmation

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(deleteTargetId);
    setDeleteTargetId(null);
    try {
      await deleteInventory(deleteTargetId);
      refetch();
    } catch (err) {
      console.error('Failed to delete item:', err.message);
    } finally {
      setIsDeleting(null);
    }
  };

  // Filtered Inventories logic
  const filteredInventories = inventories.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <AlertDialog
      open={!!deleteTargetId}
      onOpenChange={(open) => {
        if (!open) setDeleteTargetId(null);
      }}
    >
      <div className="space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Inventory Items</h1>
            <p className="text-sm text-slate-500">Manage ingredients, stock levels, and alert settings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={refetch} disabled={loading} className="rounded-full cursor-pointer bg-white" title="Refresh Data">
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleOpenAdd} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center gap-1.5 px-4 h-9 cursor-pointer transition-colors">
              <Plus className="size-4" />
              Add Item
            </Button>
            <Button onClick={() => setIsPlanningOpen(true)} variant="outline" className="bg-orange-500 hover:bg-orange-600 hover:text-white text-white rounded-full flex items-center gap-1.5 px-4 h-9 cursor-pointer transition-colors">
              <ClipboardList className="size-4" />
              Simulasi Produksi
            </Button>
          </div>
        </div>

        {/* Filter and Search Bar Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="size-4" />
              </span>
              <Input placeholder="Search by item name ..." className="pl-9 bg-slate-50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Main Grid View */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-slate-200 rounded-full w-2/3" />
                    <div className="h-3 bg-slate-200 rounded-full w-1/3" />
                  </div>
                  <div className="h-4 bg-slate-200 rounded-full w-12" />
                </div>
                <div className="h-8 bg-slate-100 rounded-2xl" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-slate-200 rounded-full w-1/4" />
                  <div className="flex gap-2">
                    <div className="size-8 bg-slate-200 rounded-full" />
                    <div className="size-8 bg-slate-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
            <p className="font-semibold">Error Loading Inventories</p>
            <p className="text-sm mt-1">{error.message || 'Please check your backend connection.'}</p>
            <Button variant="outline" size="sm" onClick={refetch} className="mt-3 cursor-pointer">
              Retry Connection
            </Button>
          </div>
        ) : filteredInventories.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 max-w-lg mx-auto shadow-sm">
            <Info className="size-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-medium text-slate-700">No Items Found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search criteria or add a brand-new item.</p>
            <Button onClick={handleOpenAdd} className="mt-4 bg-orange-500 text-white rounded-full cursor-pointer hover:bg-orange-600">
              Add New Item
            </Button>
            <Button onClick={() => setIsPlanningOpen(true)} variant="outline" className="bg-orange-500 hover:bg-orange-600 hover:text-white text-white rounded-full flex items-center gap-1.5 px-4 h-9 cursor-pointer transition-colors">
              <ClipboardList className="size-4" />
              Simulasi Produksi
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventories.map((item) => {
              return (
                <Card key={item.id} className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all rounded-3xl flex flex-col justify-between">
                  <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                    {/* Title & Category Row */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base line-clamp-1">{item.name}</h3>
                        {/* <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span> */}
                      </div>
                    </div>

                    {/* Quantity Indicator Bar */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col gap-1.5">
                      <div className="flex justify-between items-baseline text-sm">
                        <span className="text-slate-500 font-medium">Available Quantity</span>
                        <span className="font-bold text-slate-800">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Pricing and Action row */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Unit Price</span>
                        <span className="text-sm font-bold text-slate-800">Rp {item.price.toLocaleString('id-ID')}</span>
                      </div>

                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)} className="size-8 rounded-full cursor-pointer hover:bg-slate-100 text-slate-600 hover:text-slate-800" title="Edit Item">
                          <Edit2 className="size-3.5" />
                        </Button>

                        {/* Delete button — triggers AlertDialog */}
                        <AlertDialogTrigger
                          render={
                            <Button variant="ghost" size="icon" disabled={isDeleting === item.id} className="size-8 rounded-full cursor-pointer hover:bg-red-50 text-red-500 hover:text-red-600" title="Delete Item">
                              <Trash2 className="size-3.5" />
                            </Button>
                          }
                          onClick={() => setDeleteTargetId(item.id)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add / Edit Dialog Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-xl rounded-4xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
            </DialogHeader>
            <div className="pt-2">
              <InventoryForm
                initialData={editingItem}
                onSubmitSuccess={() => {
                  setIsFormOpen(false);
                  refetch();
                }}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

        <PlanningModal open={isPlanningOpen} onOpenChange={setIsPlanningOpen} />

        {/* Delete Confirmation AlertDialog */}
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-50 text-red-500">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle className="text-slate-900 font-bold">Delete this item?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">This action cannot be undone. The item will be permanently removed from your inventory.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" className="rounded-full cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-full cursor-pointer bg-red-500 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>
  );
}
