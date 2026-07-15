import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { createInventory, updateInventory } from '@/services/inventoryService';
import { UNIT_OPTIONS } from "@/lib/constants"

// Class buat hilangin spinner angka + cegah browser render panah
const noSpinnerClass = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

// Cegah user ngetik karakter yang bikin angka jadi invalid (minus, plus, notasi e)
const blockInvalidNumberKeys = (e) => {
  if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
};

const inventorySchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Name is too long'),
  quantity: z
    .string()
    .min(1, 'Quantity is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Quantity must be a positive number',
    }),
  unit: z.string().min(1, 'Unit is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Price must be a positive number',
    }),
  minStock: z
    .string()
    .min(1, 'Minimum stock threshold is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Minimum stock must be a positive number',
    }),
  description: z.string(),
});

export default function InventoryForm({ initialData, onSubmitSuccess, onCancel }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData;

  const {
    register: formRegister,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: initialData?.name || '',
      // kosong, bukan "0" — biar tidak ketiban angka nol saat mulai ngetik
      quantity: initialData?.quantity?.toString() || '',
      unit: initialData?.unit || '',
      price: initialData?.price?.toString() || '',
      minStock: initialData?.minStock?.toString() || '',
      description: initialData?.description || '',
    },
  });

  const onSubmit = async (data) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateInventory(initialData.id, data);
      } else {
        await createInventory(data);
      }
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save inventory item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-slate-800">
      {errorMsg && <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">{errorMsg}</div>}

      {/* Item Name */}
      <div className="space-y-1">
        <Label htmlFor="name">Item Name</Label>
        <Input id="name" placeholder="e.g. Matcha Powder" {...formRegister('name')} aria-invalid={!!errors.name} />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>

      {/* Quantity & Unit in a row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 10"
            className={noSpinnerClass}
            onKeyDown={blockInvalidNumberKeys}
            onWheel={(e) => e.target.blur()}
            {...formRegister('quantity')}
            aria-invalid={!!errors.quantity}
          />
          {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="unit">Unit</Label>
          <Controller
            control={control}
            name="unit"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="unit" aria-invalid={!!errors.unit} className="w-full">
                  <SelectValue placeholder="Pilih satuan" />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.unit && <p className="text-xs text-destructive mt-1">{errors.unit.message}</p>}
        </div>
      </div>

      {/* Price & Minimum Stock Alert Threshold */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="price">Price (Rp) per Unit</Label>
          <Input id="price" type="number" min={0} placeholder="e.g. 50000" className={noSpinnerClass} onKeyDown={blockInvalidNumberKeys} onWheel={(e) => e.target.blur()} {...formRegister('price')} aria-invalid={!!errors.price} />
          {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="minStock">Min Stock Alert</Label>
          <Input id="minStock" type="number" min={0} placeholder="e.g. 3" className={noSpinnerClass} onKeyDown={blockInvalidNumberKeys} onWheel={(e) => e.target.blur()} {...formRegister('minStock')} aria-invalid={!!errors.minStock} />
          {errors.minStock && <p className="text-xs text-destructive mt-1">{errors.minStock.message}</p>}
        </div>
      </div>

      {/* Description — full width, textarea biar lega */}
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="e.g. Matcha powder premium" rows={3} {...formRegister('description')} aria-invalid={!!errors.description} />
        {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="rounded-full cursor-pointer">
          Cancel
        </Button>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full cursor-pointer disabled:opacity-75" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin mr-1" />
              Saving...
            </>
          ) : isEditMode ? (
            'Save Changes'
          ) : (
            'Add Item'
          )}
        </Button>
      </div>
    </form>
  );
}
