import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Plus, Trash2, CalendarIcon, Loader2, ClipboardList } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import { useRecipes } from '@/hooks/useRecipes';
import { useInventories } from '@/hooks/useInventory';
import { usePlannings } from '@/hooks/usePlannings';
import { createPlanning } from '@/services/planningService';
import PlanningDetailModal from '@/components/shared/PlanningDetailModal';

const noSpinnerClass = '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
const blockInvalidNumberKeys = (e) => {
  if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
};

const planningSchema = z
  .object({
    name: z.string().min(1, 'Nama simulasi wajib diisi'),
    startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
    endDate: z.string().min(1, 'Tanggal akhir wajib diisi'),
    menus: z
      .array(
        z.object({
          menuId: z.string().min(1, 'Pilih menu'),
          quantity: z
            .string()
            .min(1, 'Kuantitas wajib diisi')
            .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
              message: 'Kuantitas harus lebih dari 0',
            }),
        }),
      )
      .min(1, 'Minimal pilih 1 menu'),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'Tanggal akhir tidak boleh sebelum tanggal mulai',
    path: ['endDate'],
  });

export default function PlanningModal({ open, onOpenChange }) {
  const { recipes, loading: loadingRecipes } = useRecipes(open);
  const { plannings, loading: loadingPlannings, refetch } = usePlannings(open);
  const { inventories } = useInventories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingId, setViewingId] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(planningSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      menus: [{ menuId: '', quantity: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'menus' });
  const watchedMenus = watch('menus');

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await createPlanning({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        menus: data.menus.map((m) => ({
          menuId: m.menuId,
          quantity: Number(m.quantity),
        })),
      });

      toast.success("Planning berhasil dibuat");

      reset();
      refetch();
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "Gagal membuat planning");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl bg-white border border-slate-200 shadow-xl rounded-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="size-5 text-orange-500" />
              Simulasi Rencana Produksi
            </DialogTitle>
          </DialogHeader>

          {/* ── Form Create ─────────────────────────────── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-slate-800 pt-2">
            <div className="space-y-1.5 min-w-0">
              <Label htmlFor="planning-name">Nama Simulasi</Label>
              <Input id="planning-name" placeholder="e.g. Rencana Produksi Minggu 1 Juli" {...register('name')} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {['startDate', 'endDate'].map((fieldName) => (
                <div key={fieldName} className="space-y-1.5">
                  <Label>{fieldName === 'startDate' ? 'Tanggal Mulai' : 'Tanggal Akhir'}</Label>
                  <Controller
                    control={control}
                    name={fieldName}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 size-4 text-slate-400" />
                            {field.value ? format(new Date(field.value), 'dd MMM yyyy') : 'Pilih tanggal'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                              mode="single"
                              selected={
                                field.value
                                  ? new Date(field.value)
                                  : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(
                                  date ? format(date, "yyyy-MM-dd") : ""
                                )
                              }
                            />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors[fieldName] && <p className="text-xs text-destructive mt-1">{errors[fieldName].message}</p>}
                </div>
              ))}
            </div>

            {/* Menus dinamis */}
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_90px_32px] gap-2 items-center">
                <span className="text-sm font-medium text-slate-700">Menu</span>
                <span className="text-sm font-medium text-slate-700">Target</span>
                <span />
              </div>

              {loadingRecipes ? (
                <div className="flex items-center gap-2 text-sm text-slate-400 py-3">
                  <Loader2 className="size-4 animate-spin" />
                  Loading menu...
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((field, index) => {
                    const usedElsewhere = watchedMenus
                      ?.filter((_, i) => i !== index)
                      .map((m) => m.menuId)
                      .filter(Boolean);
                    const availableRecipes = recipes.filter((r) => !usedElsewhere?.includes(String(r.id)));
                    const menuItems = availableRecipes.map((r) => ({
                      label: r.name,
                      value: String(r.id),
                    }));

                    return (
                      <div key={field.id} className="grid grid-cols-[1fr_90px_32px] gap-2 items-start">
                        <div>
                          <Controller
                            control={control}
                            name={`menus.${index}.menuId`}
                            render={({ field: selectField }) => (
                              <Select items={menuItems} value={selectField.value} onValueChange={selectField.onChange}>
                                <SelectTrigger aria-invalid={!!errors.menus?.[index]?.menuId} className="w-full min-w-0">
                                  <SelectValue placeholder="Pilih menu" className="truncate" />
                                </SelectTrigger>
                                <SelectContent>
                                  {menuItems.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.menus?.[index]?.menuId && <p className="text-xs text-destructive mt-1">{errors.menus[index].menuId.message}</p>}
                        </div>

                        <div>
                          <Input
                            type="number"
                            min={0}
                            step="any"
                            placeholder="0"
                            className={noSpinnerClass}
                            onKeyDown={blockInvalidNumberKeys}
                            onWheel={(e) => e.target.blur()}
                            {...register(`menus.${index}.quantity`)}
                            aria-invalid={!!errors.menus?.[index]?.quantity}
                          />
                          {errors.menus?.[index]?.quantity && <p className="text-xs text-destructive mt-1">{errors.menus[index].quantity.message}</p>}
                        </div>

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

              {errors.menus?.root && <p className="text-xs text-destructive">{errors.menus.root.message}</p>}

              <button type="button" onClick={() => append({ menuId: '', quantity: '' })} className="flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 cursor-pointer mt-1">
                <Plus className="size-4" />
                Tambah Menu
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button type="submit" disabled={isSubmitting} className="rounded-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1" /> Menyimpan...
                  </>
                ) : (
                  'Jalankan Simulasi'
                )}
              </Button>
            </div>
          </form>

          {/* ── Histori ─────────────────────────────── */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Riwayat Simulasi</h3>

            {loadingPlannings ? (
              <p className="text-sm text-slate-400 py-2">Loading riwayat...</p>
            ) : plannings.length === 0 ? (
              <p className="text-sm text-slate-400 py-2">Belum ada simulasi yang dibuat.</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {plannings.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => setViewingId(p._id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400">
                        {format(new Date(p.startDate), 'dd MMM yyyy')} — {format(new Date(p.endDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">Lihat detail</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PlanningDetailModal
        planningId={viewingId}
        open={!!viewingId}
        onOpenChange={(open) => {
          if (!open) setViewingId(null);
        }}
        recipes={recipes}
        inventories={inventories}
        onDeleted={() => {
          setViewingId(null);
          refetch();
        }}
      />
    </>
  );
}
