import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { verifyResetCode } from '@/services/auth.services';

export function useVerifyResetCode() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyResetCode = async (e, email, code) => {
    e.preventDefault();

    if (code.length < 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    setLoading(true);

    try {
      // Memanggil fungsi service
      const response = await verifyResetCode({ email, code });
      
      toast.success('Code verified successfully!');
      
      // Ambil resetToken dari respons backend (sesuaikan dengan format response ApiResponse-mu)
      // Biasanya: response.data ATAU response.data.data
      const resetToken = response.resetToken || response.data?.resetToken || response.data?.data?.resetToken;
      
      // Arahkan ke halaman reset password terakhir dengan mengirimkan token
      // Kita tetap menggunakan navigasi berbasis state agar URL bersih
      navigate('/reset-password', { state: { resetToken } });
      
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Invalid or expired code';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { handleVerifyResetCode, loading };
}