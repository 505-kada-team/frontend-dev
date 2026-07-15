import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "@/layouts/MainLayout"
import AuthLayout from "@/layouts/AuthLayout"
import InventoryDetailPage from "@/pages/InventoryDetailPage"

import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import DashboardPage from "@/pages/DashboardPage"
import InventoryPage from "@/pages/InventoryPage"
import RecipePage from "@/pages/RecipePage"
import SellingPlanPage from "@/pages/SellingPlanPage"
import SettingsPage from "@/pages/SettingsPage"
import VerifyEmailPage from "@/pages/VerifyEmail"
import ForgotPassword from "@/pages/ForgorPassword"
import VerifyResetCodePage from "@/pages/VerifyResetCode"
import ResetPassword from "@/pages/ResetPassword"

export default function AppRoutes() {
  return (
    <Routes>
      {/* redirect halaman utama ke login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* grup halaman publik */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path= "/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="verify-reset-code" element={<VerifyResetCodePage/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
      </Route>

      {/* grup halaman privat */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inventories" element={<InventoryPage />} />
        <Route path="/inventories/:id" element={<InventoryDetailPage />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/selling-plan" element={<SellingPlanPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* fallback kalau URL tidak ada */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}