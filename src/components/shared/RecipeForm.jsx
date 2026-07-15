import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { UNIT_OPTIONS } from "@/lib/constants"

const noSpinnerClass =
  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

const blockInvalidNumberKeys = (e) => {
  if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault()
}

const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required").max(100, "Name is too long"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be a positive number",
    }),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name is required"),
        quantity: z
          .string()
          .min(1, "Quantity is required")
          .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Must be a positive number",
          }),
        unit: z.string().min(1, "Unit is required"),
      })
    )
    .min(1, "At least one ingredient is required"),
})

export default function RecipeForm({ initialData, onSubmitSuccess, onCancel }) {
  const isEditMode = !!initialData

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price?.toString() || "",
      ingredients: initialData?.ingredients?.length
        ? initialData.ingredients.map((ing) => ({
            name: ing.name || "",
            quantity: ing.quantity?.toString() || "",
            unit: ing.unit || "",
          }))
        : [{ name: "", quantity: "", unit: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  })

  const onSubmit = (data) => {
    // data sudah tervalidasi penuh di sini — nama resep, harga, dan
    // setiap ingredient (min 1 baris, tiap baris lengkap) dijamin terisi.
    // Nanti tinggal panggil createRecipe(data) / updateRecipe(id, data) di sini.
    if (onSubmitSuccess) onSubmitSuccess(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-slate-800">
      {/* Recipe Name */}
      <div className="space-y-1.5">
        <Label htmlFor="recipe-name" className="text-slate-700">
          Recipe Name
        </Label>
        <Input
          id="recipe-name"
          placeholder="e.g. Brown Sugar Boba Latte"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Ingredients Section */}
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_80px_110px_32px] gap-2 items-center">
          <span className="text-sm font-medium text-slate-700">Ingredient</span>
          <span className="text-sm font-medium text-slate-700">Qty</span>
          <span className="text-sm font-medium text-slate-700">Unit</span>
          <span />
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_80px_110px_32px] gap-2 items-start">
              {/* Ingredient Name */}
              <div>
                <Input
                  placeholder="e.g. Tapioca Pearls"
                  {...register(`ingredients.${index}.name`)}
                  aria-invalid={!!errors.ingredients?.[index]?.name}
                />
                {errors.ingredients?.[index]?.name && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.ingredients[index].name.message}
                  </p>
                )}
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
                {errors.ingredients?.[index]?.quantity && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.ingredients[index].quantity.message}
                  </p>
                )}
              </div>

              {/* Unit */}
              <div>
                <Controller
                  control={control}
                  name={`ingredients.${index}.unit`}
                  render={({ field: selectField }) => (
                    <Select onValueChange={selectField.onChange} value={selectField.value}>
                      <SelectTrigger aria-invalid={!!errors.ingredients?.[index]?.unit} className="w-full">
                        <SelectValue placeholder="Unit" />
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
                {errors.ingredients?.[index]?.unit && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.ingredients[index].unit.message}
                  </p>
                )}
              </div>

              {/* Remove button — hidden on first row */}
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
          ))}
        </div>

        {errors.ingredients?.root && (
          <p className="text-xs text-destructive">{errors.ingredients.root.message}</p>
        )}

        {/* Add Ingredient button */}
        <button
          type="button"
          onClick={() => append({ name: "", quantity: "", unit: "" })}
          className="flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors cursor-pointer mt-1"
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
        <Input
          id="recipe-price"
          type="number"
          min={0}
          placeholder="e.g. 25000"
          className={noSpinnerClass}
          onKeyDown={blockInvalidNumberKeys}
          onWheel={(e) => e.target.blur()}
          {...register("price")}
          aria-invalid={!!errors.price}
        />
        {errors.price && (
          <p className="text-xs text-destructive mt-1">{errors.price.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-full cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="rounded-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isEditMode ? "Save Changes" : "Save Recipe"}
        </Button>
      </div>
    </form>
  )
}