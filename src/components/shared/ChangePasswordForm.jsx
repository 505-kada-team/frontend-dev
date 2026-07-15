import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Check } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useChangePassword } from "@/hooks/useChangePassword";

const schema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),

    newPassword: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

export default function ChangePasswordForm() {
  const { handleChangePassword, isLoading } = useChangePassword();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await handleChangePassword(data);

      toast.success(response.message);

      setIsSuccess(true);

      reset();

      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to change password",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label>Current Password</Label>

        <Input type="password" {...register("oldPassword")} />

        {errors.oldPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.oldPassword.message}
          </p>
        )}
      </div>

      <div>
        <Label>New Password</Label>

        <Input type="password" {...register("newPassword")} />

        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <Label>Confirm Password</Label>

        <Input type="password" {...register("confirmPassword")} />

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || isSuccess}
          className={`rounded-xl transition-all duration-300 ${
            isSuccess ? "bg-green-600 hover:bg-green-600" : ""
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Success
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
