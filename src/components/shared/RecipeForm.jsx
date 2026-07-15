import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useInventories } from '@/hooks/useInventory';
import { getCompatibleUnits, convertToBase } from '@/lib/units';

const noSpinnerClass = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

const blockInvalidNumberKeys = (e) => {
  if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
};

const recipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required').max(100, 'Name is too long'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Price must be a positive number',
    }),
  ingredients: z
    .array(
      z.object({
        inventoryId: z.string().min(1, 'Please select an ingredient'),
        quantity: z
          .string()
          .min(1, 'Quantity is required')
          .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: 'Must be a positive number',
          }),
        unit: z.string().min(1, 'Unit is required'),
      }),
    )
    .min(1, 'At least one ingredient is required'),
});

export default function RecipeForm({ initialData, onSubmitSuccess, onCancel }) {
  const isEditMode = !!initialData;
  const { inventories, loading: loadingInventories } = useInventories();

  // Normalisasi id jadi string dari awal — sumber kebenaran tunggal
  // untuk semua perbandingan/value di form ini, supaya tidak ada lagi
  // mismatch number vs string yang bikin Select salah nampilin value.
  const normalizedInventories = inventories.map((inv) => ({
    ...inv,
    id: String(inv.id),
  }));

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price?.toString() || '',
      ingredients: initialData?.ingredients?.length
        ? initialData.ingredients.map((ing) => ({
            inventoryId: ing.inventoryId ? String(ing.inventoryId) : '',
            quantity: ing.quantity?.toString() || '',
            unit: ing.unit || '',
          }))
        : [{ inventoryId: '', quantity: '', unit: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const watchedIngredients = watch('ingredients');

  // Dipanggil setiap kali dropdown ingredient di baris tertentu berubah.
  // Langsung set unit default-nya di sini (bukan lewat useEffect terpisah)
  // supaya alurnya satu arah dan gampang ditelusuri kalau ada bug lagi.
  const handleIngredientChange = (index, newInventoryId) => {
    setValue(`ingredients.${index}.inventoryId`, newInventoryId);
    const selected = normalizedInventories.find((inv) => inv.id === newInventoryId);
    setValue(`ingredients.${index}.unit`, selected?.unit || '');
  };

  const onSubmit = (data) => {
    const enrichedIngredients = data.ingredients.map((ing) => {
      const item = normalizedInventories.find((inv) => inv.id === ing.inventoryId);
      const quantityNum = Number(ing.quantity);
      return {
        inventoryId: ing.inventoryId,
        name: item?.name || '',
        quantity: quantityNum,
        unit: ing.unit,
        quantityInBaseUnit: convertToBase(quantityNum, ing.unit),
      };
    });

    if (onSubmitSuccess) onSubmitSuccess({ ...data, ingredients: enrichedIngredients });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-slate-800">
      {/* Recipe Name */}
      <div className="space-y-1.5">
        <Label htmlFor="recipe-name" className="text-slate-700">
          Recipe Name
        </Label>
        <Input id="recipe-name" placeholder="e.g. Brown Sugar Boba Latte" {...register('name')} aria-invalid={!!errors.name} />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>

      {/* Ingredients Section */}
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_64px_90px_28px] gap-2 items-center">
          <span className="text-sm font-medium text-slate-700">Ingredient</span>
          <span className="text-sm font-medium text-slate-700">Qty</span>
          <span className="text-sm font-medium text-slate-700">Unit</span>
          <span />
        </div>

        {loadingInventories ? (
          <div className="flex items-center gap-2 text-sm text-slate-400 py-3">
            <Loader2 className="size-4 animate-spin" />
            Loading inventory items...
          </div>
        ) : normalizedInventories.length === 0 ? (
          <p className="text-sm text-slate-400 py-3">No inventory items found. Add items in Inventory first.</p>
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => {
              const currentInventoryId = watchedIngredients?.[index]?.inventoryId;
              const selectedItem = normalizedInventories.find((inv) => inv.id === currentInventoryId);
              const compatibleUnits = selectedItem ? getCompatibleUnits(selectedItem.unit) : [];

              const usedElsewhere = watchedIngredients
                ?.filter((_, i) => i !== index)
                .map((ing) => ing.inventoryId)
                .filter(Boolean);

              const availableOptions = normalizedInventories.filter((inv) => !usedElsewhere?.includes(inv.id));

              const ingredientItems = availableOptions.map((inv) => ({
                label: inv.name,
                value: inv.id,
              }));
              const unitItems = compatibleUnits.map((u) => ({
                label: u.label,
                value: u.value,
              }));

              return (
                <div key={field.id} className="grid grid-cols-[1fr_64px_90px_28px] gap-2 items-start">
                  {/* Ingredient */}
                  <div className="min-w-0">
                    <Controller
                      control={control}
                      name={`ingredients.${index}.inventoryId`}
                      render={({ field: selectField }) => (
                        <Select items={ingredientItems}  value={selectField.value} onValueChange={(val) => handleIngredientChange(index, val)}>
                          <SelectTrigger aria-invalid={!!errors.ingredients?.[index]?.inventoryId} className="w-full">
                            <SelectValue placeholder="Pilih bahan" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableOptions.map((inv) => (
                              <SelectItem key={inv.id} value={inv.id}>
                                {inv.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.ingredients?.[index]?.inventoryId && <p className="text-xs text-destructive mt-1">{errors.ingredients[index].inventoryId.message}</p>}
                  </div>

                  {/* Quantity */}
                  <div>
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      placeholder="0"
                      className={noSpinnerClass}
                      onKeyDown={blockInvalidNumberKeys}
                      onWheel={(e) => e.target.blur()}
                      {...register(`ingredients.${index}.quantity`)}
                      aria-invalid={!!errors.ingredients?.[index]?.quantity}
                    />
                    {errors.ingredients?.[index]?.quantity && <p className="text-xs text-destructive mt-1">{errors.ingredients[index].quantity.message}</p>}
                  </div>

                  {/* Unit */}
                  <div>
                    <Controller
                      control={control}
                      name={`ingredients.${index}.unit`}
                      render={({ field: unitField }) => (
                        <Select items={unitItems} value={unitField.value} onValueChange={unitField.onChange} disabled={!selectedItem}>
                          <SelectTrigger aria-invalid={!!errors.ingredients?.[index]?.unit} className="w-full">
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            {compatibleUnits.map((u) => (
                              <SelectItem key={u.value} value={u.value}>
                                {u.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Remove */}
                  {fields.length === 1 ? (
                    <div className="size-8" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="size-8 flex items-center justify-center rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors cursor-pointer"
                      title="Remove ingredient"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {errors.ingredients?.root && <p className="text-xs text-destructive">{errors.ingredients.root.message}</p>}

        <button
          type="button"
          onClick={() => append({ inventoryId: '', quantity: '', unit: '' })}
          disabled={loadingInventories || normalizedInventories.length === 0}
          className="flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer mt-1"
        >
          <Plus className="size-4" />
          Add Ingredient
        </button>
      </div>

      {/* Price Per Recipe */}
      <div className="space-y-1.5">
        <Label htmlFor="recipe-price" className="text-slate-700">
          Price per Recipe (Rp)
        </Label>
        <Input id="recipe-price" type="number" min={0} placeholder="e.g. 25000" className={noSpinnerClass} onKeyDown={blockInvalidNumberKeys} onWheel={(e) => e.target.blur()} {...register('price')} aria-invalid={!!errors.price} />
        {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-full cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50">
          Cancel
        </Button>
        <Button type="submit" className="rounded-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white">
          {isEditMode ? 'Save Changes' : 'Save Recipe'}
        </Button>
      </div>
    </form>
  );
}
