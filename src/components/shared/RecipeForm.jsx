import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useInventories } from '@/hooks/useInventory';
import { createRecipe, updateRecipe } from '@/services/recipeService';

import { getCompatibleUnits, convertUnits } from '@/lib/units';

const noSpinnerClass = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
const blockInvalidNumberKeys = (e) => {
  if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
};

const recipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required').max(100, 'Name is too long'),
  description: z.string().optional(),
  sellingPrice: z
    .string()
    .min(1, 'Selling price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Selling price must be a positive number',
    }),
  ingredients: z
    .array(
      z.object({
        inventoryId: z.string().min(1, 'Please select an ingredient'),
        quantityNeeded: z
          .string()
          .min(1, 'Quantity is required')
          .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'Must be greater than 0',
          }),
        unit: z.string().min(1, 'Unit is required'),
      }),
    )
    .min(1, 'At least one ingredient is required'),
});

export default function RecipeForm({ initialData, onSubmitSuccess, onCancel }) {
  const isEditMode = !!initialData;
  const { inventories, loading: loadingInventories } = useInventories();
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedInventories = inventories.map((inv) => ({ ...inv, id: String(inv.id) }));

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
      description: initialData?.description || '',
      sellingPrice: initialData?.sellingPrice?.toString() || '',
      ingredients: initialData?.ingredients?.length
        ? initialData.ingredients.map((ing) => ({
            inventoryId: String(ing.inventoryId),
            quantityNeeded: ing.quantityNeeded?.toString() || '',
            unit: ing.unit || '',
          }))
        : [{ inventoryId: '', quantityNeeded: '', unit: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'ingredients' });
  const watchedIngredients = watch('ingredients');

  const handleIngredientChange = (index, newInventoryId, setValueFn) => {
    setValueFn(`ingredients.${index}.inventoryId`, newInventoryId);
    const selected = normalizedInventories.find((inv) => inv.id === newInventoryId);
    setValueFn(`ingredients.${index}.unit`, selected?.unit || '');
  };

  const onSubmit = async (data) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        sellingPrice: Number(data.sellingPrice),
        ingredients: data.ingredients.map((ing) => {
          const item = normalizedInventories.find((inv) => inv.id === ing.inventoryId);
          const convertedQty = convertUnits(Number(ing.quantityNeeded), ing.unit, item?.unit || ing.unit);
          return {
            inventoryId: ing.inventoryId,
            quantityNeeded: convertedQty,
          };
        }),
      };

      if (isEditMode) {
        await updateRecipe(initialData.id, payload);
      } else {
        await createRecipe(payload);
      }
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to save recipe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-slate-800">
      {errorMsg && <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">{errorMsg}</div>}

      {/* Recipe Name */}
      <div className="space-y-1.5">
        <Label htmlFor="recipe-name">Recipe Name</Label>
        <Input id="recipe-name" placeholder="e.g. Brown Sugar Boba Latte" {...register('name')} aria-invalid={!!errors.name} />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="recipe-description">Description</Label>
        <Textarea id="recipe-description" placeholder="Opsional" rows={2} {...register('description')} />
      </div>

      {/* Ingredients Section */}
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_90px_60px_32px] gap-2 items-center">
          <span className="text-sm font-medium text-slate-700">Ingredient</span>
          <span className="text-sm font-medium text-slate-700">Qty</span>
          <span className="text-sm font-medium text-slate-700">Unit</span>
          <span />
        </div>

        {loadingInventories ? (
          <div className="flex items-center gap-2 text-sm text-slate-400 py-3">
            <Loader2 className="size-4 animate-spin" /> Loading inventory items...
          </div>
        ) : normalizedInventories.length === 0 ? (
          <p className="text-sm text-slate-400 py-3">No inventory items found. Add items in Inventory first.</p>
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => {
              const currentInventoryId = watchedIngredients?.[index]?.inventoryId;
              const selectedItem = normalizedInventories.find((inv) => inv.id === currentInventoryId);

              const usedElsewhere = watchedIngredients
                ?.filter((_, i) => i !== index)
                .map((ing) => ing.inventoryId)
                .filter(Boolean);

              const availableOptions = normalizedInventories.filter((inv) => !usedElsewhere?.includes(inv.id));
              const ingredientItems = availableOptions.map((inv) => ({ label: inv.name, value: inv.id }));

              return (
                <div key={field.id} className="grid grid-cols-[1fr_90px_60px_32px] gap-2 items-start">
                  {/* Ingredient */}
                  <div className="min-w-0">
                    <Controller
                      control={control}
                      name={`ingredients.${index}.inventoryId`}
                      render={({ field: selectField }) => (
                        <Select items={ingredientItems} value={selectField.value} onValueChange={(val) => handleIngredientChange(index, val, setValue)}>
                          <SelectTrigger aria-invalid={!!errors.ingredients?.[index]?.inventoryId} className="w-full min-w-0">
                            <SelectValue placeholder="Pilih bahan" className="truncate" />
                          </SelectTrigger>
                          <SelectContent>
                            {ingredientItems.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.ingredients?.[index]?.inventoryId && <p className="text-xs text-destructive mt-1">{errors.ingredients[index].inventoryId.message}</p>}
                  </div>

                  {/* Quantity — selalu dalam satuan asli si Inventory, tidak ada konversi */}
                  <div>
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      placeholder="0"
                      className={noSpinnerClass}
                      onKeyDown={blockInvalidNumberKeys}
                      onWheel={(e) => e.target.blur()}
                      {...register(`ingredients.${index}.quantityNeeded`)}
                      aria-invalid={!!errors.ingredients?.[index]?.quantityNeeded}
                    />
                    {errors.ingredients?.[index]?.quantityNeeded && <p className="text-xs text-destructive mt-1">{errors.ingredients[index].quantityNeeded.message}</p>}
                  </div>

                  {/* Unit — read-only, ikut satuan Inventory-nya, tidak dikirim ke backend
                  <Input value={selectedItem?.unit || "—"} disabled className="bg-slate-50 text-slate-400 text-center" /> */}

                  {/* Unit — bisa dipilih, dibatasi kategori satuan Inventory-nya */}
                  <Controller
                    control={control}
                    name={`ingredients.${index}.unit`}
                    render={({ field: unitField }) => {
                      const unitItems = selectedItem ? getCompatibleUnits(selectedItem.unit) : [];
                      return (
                        <Select items={unitItems} value={unitField.value} onValueChange={unitField.onChange} disabled={!selectedItem}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitItems.map((u) => (
                              <SelectItem key={u.value} value={u.value}>
                                {u.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  {/* Remove */}
                  {fields.length === 1 ? (
                    <div className="size-8" />
                  ) : (
                    <button type="button" onClick={() => remove(index)} className="size-8 flex items-center justify-center rounded-full border border-red-200 text-red-400 hover:bg-red-50 cursor-pointer">
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
          onClick={() => append({ inventoryId: '', quantityNeeded: '' })}
          disabled={loadingInventories || normalizedInventories.length === 0}
          className="flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer mt-1"
        >
          <Plus className="size-4" /> Add Ingredient
        </button>
      </div>

      {/* Selling Price */}
      <div className="space-y-1.5">
        <Label htmlFor="recipe-price">Price per Recipe (Rp)</Label>
        <Input
          id="recipe-price"
          type="number"
          min={0}
          placeholder="e.g. 25000"
          className={noSpinnerClass}
          onKeyDown={blockInvalidNumberKeys}
          onWheel={(e) => e.target.blur()}
          {...register('sellingPrice')}
          aria-invalid={!!errors.sellingPrice}
        />
        {errors.sellingPrice && <p className="text-xs text-destructive mt-1">{errors.sellingPrice.message}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="rounded-full cursor-pointer">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="rounded-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin mr-1" /> Saving...
            </>
          ) : isEditMode ? (
            'Save Changes'
          ) : (
            'Save Recipe'
          )}
        </Button>
      </div>
    </form>
  );
}
