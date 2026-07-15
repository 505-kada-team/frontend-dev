import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from  "react-hot-toast";

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

import {
  createInventory,
  updateInventory,
} from "@/services/inventoryService";

import { UNIT_OPTIONS } from "@/lib/constants";

const noSpinnerClass =
  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

const blockInvalidNumberKeys = (e) => {
  if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault();
};

const inventorySchema = z.object({
  name: z.string().min(1, "Item name is required"),

  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Quantity must be a positive number",
    }),

  unit: z.string().min(1, "Unit is required"),

  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be a positive number",
    }),

  minStock: z
    .string()
    .min(1, "Minimum stock is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Minimum stock must be a positive number",
    }),

  description: z.string().optional(),
});

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
      name: initialData?.name || "",
      quantity: initialData?.quantity?.toString() || "",
      unit: initialData?.unit || "kg",
      price: initialData?.price?.toString() || "",
      minStock: initialData?.minStock?.toString() || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        quantity: Number(data.quantity),
        price: Number(data.price),
        minStock: Number(data.minStock),
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
          {...register("name")}
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
            <p className="text-xs text-red-500">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="unit">Unit</Label>

          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>

                <SelectContent>
                  {UNIT_OPTIONS.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.unit && (
            <p className="text-xs text-red-500">
              {errors.unit.message}
            </p>
          )}
        </div>
      </div>

      {/* Price & Minimum Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="price">Price (Rp)</Label>

          <Input
            id="price"
            type="number"
            min={0}
            className={noSpinnerClass}
            placeholder="50000"
            onKeyDown={blockInvalidNumberKeys}
            onWheel={(e) => e.target.blur()}
            {...register("price")}
          />

          {errors.price && (
            <p className="text-xs text-red-500">
              {errors.price.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="minStock">Minimum Stock</Label>

          <Input
            id="minStock"
            type="number"
            min={0}
            className={noSpinnerClass}
            placeholder="3"
            onKeyDown={blockInvalidNumberKeys}
            onWheel={(e) => e.target.blur()}
            {...register("minStock")}
          />

          {errors.minStock && (
            <p className="text-xs text-red-500">
              {errors.minStock.message}
            </p>
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
          <p className="text-xs text-red-500">
            {errors.description.message}
          </p>
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