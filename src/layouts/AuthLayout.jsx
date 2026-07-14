import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <Outlet />
      </div>
    </div>
  )
}