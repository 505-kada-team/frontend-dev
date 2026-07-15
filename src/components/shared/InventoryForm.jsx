import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { createInventory, updateInventory } from "@/services/inventoryService";

import { UNIT_OPTIONS } from "@/lib/constants";

const noSpinnerClass =
  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

const blockInvalidNumberKeys = (e) => {
  if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault();
};

const inventorySchema = z
  .object({
    ingredientName: z.string().min(1, 'Item name is required').max(100, 'Name is too long'),

    description: z.string().optional(),

    quantity: z
    .string()
    .min(1, 'Quantity is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Quantity must be a positive number',
    }),

    unit: z.string().min(1, 'Unit is required'),

    unitCost: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Price must be a positive number',
    }),

    validFrom: z.string().min(1, 'Start date is required'),

    validTo: z.string().min(1, 'End date is required'),
  })
  .refine(
    (data) =>
      new Date(data.validTo) > new Date(data.validFrom),
    {
      path: ["validTo"],
      message: "Valid To must be later than Valid From",
    }
  );

export default function InventoryForm({
  initialData,
  onSubmitSuccess,
  onCancel,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      ingredientName: initialData?.ingredientName || "",
      quantity: initialData?.quantity?.toString() || "",
      unit: initialData?.unit || "kg",
      unitCost: initialData?.unitCost?.toString() || "",
      validFrom: initialData?.validFrom
        ? new Date(initialData.validFrom).toISOString().split("T")[0]
        : "",
      validTo: initialData?.validTo
        ? new Date(initialData.validTo).toISOString().split("T")[0]
        : "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
      };

      if (isEditMode) {
        await updateInventory(initialData.id, payload);
        toast.success("Inventory updated successfully!");
      } else {
        console.log("Payload:", payload);
        await createInventory(payload);
        toast.success("Inventory added successfully!");
      }

      onSubmitSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to save inventory");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 text-slate-800"
    >
      {/* Item Name */}
      <div className="space-y-1">
        <Label htmlFor="name">Item Name</Label>

        <Input
          id="name"
          placeholder="e.g. Matcha Powder"
          {...register("ingredientName")}
        />

        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Quantity & Unit */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="quantity">Quantity</Label>

          <Input
            id="quantity"
            type="number"
            min={0}
            step="any"
            className={noSpinnerClass}
            placeholder="10"
            onKeyDown={blockInvalidNumberKeys}
            onWheel={(e) => e.target.blur()}
            {...register("quantity")}
          />

          {errors.quantity && (
            <p className="text-xs text-red-500">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="unit">Unit</Label>

          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>

                <SelectContent>
                  {UNIT_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.unit && (
            <p className="text-xs text-red-500">{errors.unit.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

      {/* date */}
      <div className="space-y-1">
        <Label htmlFor="validFrom">Valid From</Label>

        <Input
          type="date"
          id="validFrom"
          {...register("validFrom")}
        />

        {errors.validFrom && (
          <p className="text-xs text-red-500">
            {errors.validFrom.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="validTo">Valid To</Label>

        <Input
          type="date"
          id="validTo"
          {...register("validTo")}
        />

        {errors.validTo && (
          <p className="text-xs text-red-500">
            {errors.validTo.message}
          </p>
        )}
      </div>

    </div>

      {/* Price*/}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="price">Unit Cost (Rp)</Label>

          <Input
            id="price"
            type="number"
            min={0}
            className={noSpinnerClass}
            placeholder="50000"
            onKeyDown={blockInvalidNumberKeys}
            onWheel={(e) => e.target.blur()}
            {...register("unitCost")}
          />

          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>

        <Textarea
          id="description"
          rows={3}
          placeholder="Matcha powder premium"
          {...register("description")}
        />

        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Add Item"
          )}
        </Button>
      </div>
    </form>
  );
}
