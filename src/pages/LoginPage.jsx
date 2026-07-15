import { useState } from 'react'
import { Link } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

import { useLogin } from '@/hooks/useLogin' // Import hook yang baru dibuat
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

export default function LoginPage() {
  // Hanya state UI yang tersisa di sini
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Ambil fungsi dan loading state dari hook
  const { handleLoginSubmit, loading } = useLogin()

  return (
    <Card className="w-full max-w-md shadow-lg border border-slate-200 bg-white">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
        <CardDescription className="text-slate-500">
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Pass email dan password ke handler */}
        <form onSubmit={(e) => handleLoginSubmit(e, email, password)} className="space-y-4">
          
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

          {/* Password Field */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-slate-700">
              Password
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="size-4" />
              </span>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="pl-10"
                disabled={loading}
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-medium h-10 transition-colors flex items-center justify-center gap-2 rounded-full cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-slate-100 py-4 text-center">
        <p className="text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-orange-500 hover:text-orange-600 hover:underline transition-colors"
          >
            Sign up
          </Link>
        </p>
        <Link to="/forgot-password" className="block text-center text-sm text-orange-500 hover:text-orange-700 mt-4">
        Forgot password?</Link>
      </CardFooter>
    </Card>
  )
}