import { Link } from "react-router-dom"
import { User, Mail, Lock } from "lucide-react"

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

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md shadow-lg border border-slate-200 bg-white">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-slate-900">Create an Account</CardTitle>
        <CardDescription className="text-slate-500">
          Enter your details to register a new admin account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-slate-700">
              Full Name
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="size-4" />
              </span>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-10"
              />
            </div>
          </div>

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
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-slate-700">
              Confirm Password
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="size-4" />
              </span>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Link to="/login" className="block w-full mt-2">
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium h-10 transition-colors flex items-center justify-center gap-2 rounded-full cursor-pointer"
            >
              Create Account
            </Button>
          </Link>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-slate-100 py-4 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-orange-500 hover:text-orange-600 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}