import { useState, useEffect } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { forgotPassword } from "@/services/auth.services";
import { useVerifyResetCode } from "@/hooks/useVerifyResetCode";
import OTPInput from "@/components/shared/OTPInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function VerifyResetCodePage() {
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const { handleVerifyResetCode, loading } = useVerifyResetCode();
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  // 1. PINDAHKAN FUNGSI INI KE DALAM KOMPONEN
  const onResendCode = async () => {
    try {
      await forgotPassword(email); // Panggil API
      
      setCountdown(60); // Reset waktu
      toast.success("Kode reset password baru telah dikirim ke email kamu!");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Gagal mengirim ulang kode";
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border border-slate-200 bg-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Verify Reset Code
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter the 6-digit code we sent to <br/>
            <span className="font-semibold text-slate-700">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => handleVerifyResetCode(e, email, code)} className="space-y-6">
            <div className="space-y-1.5">
              <Label className="text-slate-700 block text-center mb-2">
                Verification Code
              </Label>
              <div className="flex justify-center">
                <OTPInput length={6} value={code} onChange={setCode} />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium h-10 transition-colors flex items-center justify-center gap-2 rounded-full cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>

          {/* 2. TOMBOL RESEND PINDAH KE SINI (LUAR FORM) AGAR LEBIH AMAN */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <Button
              type="button" // Pastikan type-nya button agar tidak submit form
              variant="link"
              disabled={loading || countdown > 0} 
              onClick={onResendCode} // Cukup panggil fungsinya begini
              className="text-orange-500 hover:text-orange-600 p-0 h-auto font-medium"
            >
              {countdown > 0 
                ? `Kirim ulang dalam ${countdown} detik` 
                : "Kirim Ulang Kode"}
            </Button>
          </div>
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