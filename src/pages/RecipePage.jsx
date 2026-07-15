import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import RecipeForm from '@/components/shared/RecipeForm';
import { Search, Plus, Edit2, Trash2, BookOpen, Eye, Info } from 'lucide-react';
import Pagination from '@/components/shared/Pagination';

const ITEMS_PER_PAGE = 4;
// ─── Dummy Data (replace with real API call later) ──────────────────────────
const dummyRecipes = [
  {
    id: 1,
    name: 'Brown Sugar Boba Latte',
    ingredients: [
      { id: 1, name: 'Tapioca Pearls', quantity: 50, unit: 'gr' },
      { id: 2, name: 'Brown Sugar Syrup', quantity: 30, unit: 'ml' },
      { id: 3, name: 'Fresh Milk', quantity: 200, unit: 'ml' },
    ],
    price: 25000,
  },
  {
    id: 2,
    name: 'Matcha Latte',
    ingredients: [
      { id: 1, name: 'Matcha Powder', quantity: 5, unit: 'gr' },
      { id: 2, name: 'Almond Milk', quantity: 200, unit: 'ml' },
      { id: 3, name: 'Honey', quantity: 15, unit: 'ml' },
    ],
    price: 30000,
  },
  {
    id: 3,
    name: 'Hazelnut Espresso',
    ingredients: [
      { id: 1, name: 'Espresso Beans', quantity: 18, unit: 'gr' },
      { id: 2, name: 'Hazelnut Syrup', quantity: 20, unit: 'ml' },
      { id: 3, name: 'Fresh Milk', quantity: 150, unit: 'ml' },
    ],
    price: 35000,
  },
  {
    id: 4,
    name: 'Classic Milk Tea',
    ingredients: [
      { id: 1, name: 'Black Tea Leaves', quantity: 5, unit: 'gr' },
      { id: 2, name: 'Tapioca Pearls', quantity: 50, unit: 'gr' },
      { id: 3, name: 'Fresh Milk', quantity: 200, unit: 'ml' },
      { id: 4, name: 'Brown Sugar Syrup', quantity: 25, unit: 'ml' },
    ],
    price: 22000,
  },
  {
    id: 5,
    name: 'Classic Milk Tea',
    ingredients: [
      { id: 1, name: 'Black Tea Leaves', quantity: 5, unit: 'gr' },
      { id: 2, name: 'Tapioca Pearls', quantity: 50, unit: 'gr' },
      { id: 3, name: 'Fresh Milk', quantity: 200, unit: 'ml' },
      { id: 4, name: 'Brown Sugar Syrup', quantity: 25, unit: 'ml' },
    ],
    price: 22000,
  },
];

export default function RecipePage() {
  const [recipes, setRecipes] = useState(dummyRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (recipe) => {
    setEditingItem(recipe);
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    setRecipes((prev) => prev.filter((r) => r.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  const handleSave = (data) => {
    console.log('Recipe data:', data);
    // nanti: createRecipe(data) / updateRecipe(editingItem.id, data)
    setIsFormOpen(false);
  };

  const filteredRecipes = recipes.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const paginatedRecipes = filteredRecipes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <AlertDialog
      open={!!deleteTargetId}
      onOpenChange={(open) => {
        if (!open) setDeleteTargetId(null);
      }}
    >
      <div className="space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Recipes</h1>
            <p className="text-sm text-slate-500">Manage your drink recipes and ingredient compositions</p>
          </div>
          <Button onClick={handleOpenAdd} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center gap-1.5 px-4 h-9 cursor-pointer transition-colors">
            <Plus className="size-4" />
            Add Recipe
          </Button>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="size-4" />
            </span>
            <Input placeholder="Search recipes..." className="pl-9 bg-slate-50" value={searchTerm} onChange={handleSearchChange} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {filteredRecipes.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Info className="size-12 text-slate-300 mx-auto mb-3" />
              <p className="text-lg font-medium text-slate-700">No Recipes Found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or add a new recipe.</p>
              <Button onClick={handleOpenAdd} className="mt-4 bg-orange-500 text-white rounded-full cursor-pointer hover:bg-orange-600">
                Add New Recipe
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipe</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingredients</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price / Recipe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRecipes.map((recipe) => (
                  <tr key={recipe.id} onClick={() => setViewingItem(recipe)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                          <BookOpen className="size-4 text-orange-500" />
                        </div>
                        <span className="font-semibold text-slate-800">{recipe.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{recipe.ingredients.length} items</span>
                    </td>

                    <td className="px-5 py-4 text-right font-semibold text-slate-800">Rp {recipe.price.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recipe Count Footer */}
        <Pagination currentPage={currentPage} totalItems={filteredRecipes.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />

        {/* ── View Detail Modal ─────────────────────────────────────── */}
        <Dialog
          open={!!viewingItem}
          onOpenChange={(open) => {
            if (!open) setViewingItem(null);
          }}
        >
          <DialogContent className="sm:max-w-sm bg-white border border-slate-200 shadow-xl rounded-4xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <BookOpen className="size-3.5 text-orange-500" />
                </div>
                {viewingItem?.name}
              </DialogTitle>
            </DialogHeader>

            {viewingItem && (
              <div className="space-y-4 pt-1">
                {/* Ingredients */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Ingredients</p>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Ingredient</th>
                          <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {viewingItem.ingredients.map((ing) => (
                          <tr key={ing.id}>
                            <td className="px-4 py-2.5 text-slate-700 font-medium">{ing.name}</td>
                            <td className="px-4 py-2.5 text-right text-slate-500">
                              {ing.quantity} {ing.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                  <span className="text-sm font-medium text-slate-600">Price per Recipe</span>
                  <span className="text-base font-bold text-orange-600">Rp {viewingItem.price.toLocaleString('id-ID')}</span>
                </div>

                {/* Action Row */}
                <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100">
                  <AlertDialogTrigger
                    render={
                      <Button variant="ghost" className="rounded-full cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="size-3.5 mr-1.5" />
                        Delete
                      </Button>
                    }
                    onClick={() => setDeleteTargetId(viewingItem.id)}
                  />
                  <div className="flex gap-2">
                    <Button
                      className="rounded-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => {
                        setViewingItem(null);
                        handleOpenEdit(viewingItem);
                      }}
                    >
                      <Edit2 className="size-3.5 mr-1.5" />
                      Edit Recipe
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Add / Edit Dialog ─────────────────────────────────────── */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-xl rounded-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">{editingItem ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
            </DialogHeader>
            <div className="pt-2">
              <RecipeForm initialData={editingItem} onSubmitSuccess={handleSave} onCancel={() => setIsFormOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Delete Confirmation AlertDialog ───────────────────────── */}
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-50 text-red-500">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle className="text-slate-900 font-bold">Delete this recipe?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">This action cannot be undone. The recipe will be permanently removed.</AlertDialogDescription>
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
