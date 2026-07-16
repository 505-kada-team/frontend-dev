import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Coffee,
} from "lucide-react";

import { useLogin } from "@/hooks/useLogin";

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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { handleLoginSubmit, loading } = useLogin();

  return (
    <Card
      className="
        w-full
        max-w-[430px]
        rounded-[28px]
        border
        border-white/40
        bg-white/95
        shadow-[0_25px_80px_rgba(0,0,0,.18)]
        backdrop-blur-xl
      "
    >
      <CardHeader className="px-8 pt-8 pb-4 space-y-4">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30">
          <Coffee
            size={28}
            className="text-white"
          />
        </div>

        <div className="text-center">

          <CardTitle className="text-4xl font-bold text-slate-900">
            Welcome Back
          </CardTitle>

          <CardDescription className="mt-2 text-[15px] text-slate-500">
            Sign in to continue to your dashboard.
          </CardDescription>

        </div>

      </CardHeader>

      <CardContent className="px-8">

        <form
          onSubmit={(e) => handleLoginSubmit(e, email, password)}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div className="space-y-2">

            <Label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email Address
            </Label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={loading}
                className="
                  h-12
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-slate-800
                  placeholder:text-slate-400
                  pl-11
                  pr-4
                  shadow-sm
                  focus:border-orange-500
                  focus:ring-2
                  focus:ring-orange-500/20
                "
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="space-y-2">

            <Label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </Label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="
                  h-12
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-slate-800
                  placeholder:text-slate-400
                  pl-11
                  pr-11
                  shadow-sm
                  focus:border-orange-500
                  focus:ring-2
                  focus:ring-orange-500/20
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  transition
                  hover:text-orange-500
                "
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          <div className="flex justify-end">

            <Link
              to="/forgot-password"
              className="
                text-sm
                font-medium
                text-orange-500
                hover:text-orange-600
              "
            >
              Forgot Password?
            </Link>

          </div>

          <Button
            type="submit"
            disabled={loading}
            className="
              h-12
              w-full
              rounded-xl
              bg-orange-500
              text-base
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-orange-600
              hover:shadow-xl
              hover:shadow-orange-500/30
              disabled:opacity-70
            "
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Sign In"
            )}
          </Button>

        </form>

      </CardContent>

      <CardFooter className="border-t border-slate-200 py-5">

        <p className="w-full text-center text-sm text-slate-500">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            Create Account
          </Link>

        </p>

      </CardFooter>

    </Card>
  );
}