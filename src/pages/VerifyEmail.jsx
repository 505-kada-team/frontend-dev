import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import OTPInput from "@/components/shared/OTPInput"; // Sesuaikan path jika berbeda
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  // Menangkap email dari halaman Register (navigate state)
  const location = useLocation();
  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");

  const { handleConfirmOtp, handleResendOtp, loading } = useVerifyEmail();

  const onVerifySubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length < 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    await handleConfirmOtp(email, otp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border border-slate-200 bg-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter the code sent to your email address.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onVerifySubmit} className="space-y-6">
            
            {/* Input Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="size-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Input OTP */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 block text-center mb-2">
                Verification Code
              </Label>
              <div className="flex justify-center">
                <OTPInput length={6} value={otp} onChange={setOtp} />
              </div>
            </div>

            {/* Tombol Verify */}
            <Button
              type="submit"
              disabled={loading || otp.length < 6 || !email}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium h-10 transition-colors flex items-center justify-center gap-2 rounded-full cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
          
          {/* Tombol Resend */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => handleResendOtp(email)}
              disabled={loading}
              className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline transition-colors disabled:opacity-50 cursor-pointer"
            >
              Resend code
            </button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 py-4">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}