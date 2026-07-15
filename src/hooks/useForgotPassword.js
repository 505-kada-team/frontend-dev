import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword } from '@/services/auth.services';

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e, email) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      
      toast.success('Kode reset password telah dikirim ke email kamu!');
      
      // Arahkan ke halaman verifikasi kode dan bawa state email
      // Pastikan rute '/verify-reset-code' nanti didaftarkan di AppRoutes
      navigate('/verify-reset-code', { state: { email } });
      
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Gagal mengirim email reset password';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { handleForgotPassword, loading };
}