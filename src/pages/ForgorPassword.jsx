import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft } from "lucide-react"

import { useForgotPassword } from "@/hooks/useForgotPassword"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  
  // Ambil fungsi dan loading state dari hook
  const { handleForgotPassword, loading } = useForgotPassword()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border border-slate-200 bg-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">Forgot Password</CardTitle>
          <CardDescription className="text-slate-500">
            We will send you a reset code to your email if it is registered in our system.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Sambungkan form dengan custom hook */}
          <form onSubmit={(e) => handleForgotPassword(e, email)} className="space-y-4">
            
            {/* Email Field */}
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
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-medium h-10 transition-colors flex items-center justify-center gap-2 rounded-full cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Send Code"
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
  )
}