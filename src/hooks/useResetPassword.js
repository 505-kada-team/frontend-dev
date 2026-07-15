import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPassword } from '@/services/auth.services';

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e, resetToken, newPassword, confirmPassword) => {
    e.preventDefault();

    // Validasi input
    if (newPassword !== confirmPassword) {
      toast.error('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      // Panggil fungsi API (format argumen disesuaikan dengan auth.service.js milikmu)
      await resetPassword({ resetToken, newPassword });
      
      toast.success('Password berhasil direset! Silakan login dengan password baru.');
      
      // Arahkan ke halaman login
      navigate('/login', { replace: true });
      
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Gagal mereset password.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { handleResetPassword, loading };
}