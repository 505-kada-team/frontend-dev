import { useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

import { useResetPassword } from "@/hooks/useResetPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  // Ambil resetToken yang dilempar dari halaman VerifyResetCodePage
  const location = useLocation();
  const resetToken = location.state?.resetToken;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // State untuk toggle lihat password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Ambil fungsi dari hook
  const { handleResetPassword, loading } = useResetPassword();

  // Proteksi rute: Jika tidak ada token (misal user asal ketik URL), usir kembali
  if (!resetToken) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border border-slate-200 bg-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Create New Password
          </CardTitle>
          <CardDescription className="text-slate-500">
            Please enter your new password below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => handleResetPassword(e, resetToken, newPassword, confirmPassword)} className="space-y-4">
            
            {/* New Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-slate-700">
                New Password
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="size-4" />
                </span>
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-slate-700">
                Confirm New Password
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="size-4" />
                </span>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-medium h-10 transition-colors flex items-center justify-center gap-2 rounded-full cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Save New Password"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 py-4 text-center">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}