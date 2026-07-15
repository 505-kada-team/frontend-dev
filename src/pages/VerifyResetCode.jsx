import { useState } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
  // Ambil email yang dilempar dari halaman ForgotPasswordPage
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState("");
  
  // Ambil fungsi dari hook
  const { handleVerifyResetCode, loading } = useVerifyResetCode();

  // Jika user mencoba masuk ke halaman ini langsung via URL tanpa melewati tahap
  // kirim email (state kosong), kita kembalikan saja ke /forgot-password
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

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