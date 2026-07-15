import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e, email, password) => {
    e.preventDefault();
    setLoading(true);

    // Result akan selalu terisi entah sukses atau gagal berkat try-catch di AuthContext
    const result = await login(email, password);

    setLoading(false);

   if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      // 1. Ambil pesan error dan ubah ke huruf kecil semua agar mudah dicek
      const errorMessage = result.error?.toLowerCase() || "";

      // 2. Cek apakah pesan error mengandung kata terkait "verifikasi"
      // NOTE: Sesuaikan kata-kata di bawah ini dengan pesan error ASLI dari backend-mu!
      const isUnverified = 
        errorMessage.includes("verify") || 
        errorMessage.includes("verified") || 
        errorMessage.includes("verifikasi");

      if (isUnverified) {
        toast.error("Akun belum terverifikasi. Silakan cek email atau kirim ulang kode.");
        
        // 3. Arahkan ke halaman verifikasi dan bawa state email
        navigate("/verify-email", { state: { email } });
      } else {
        // Jika errornya karena hal lain (misal: password salah)
        toast.error(result.error);
      }
    }
  };

  return { handleLoginSubmit, loading };
}
