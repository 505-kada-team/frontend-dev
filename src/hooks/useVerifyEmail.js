import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sendVerificationEmail, confirmVerificationEmail } from '@/services/auth.services';

export function useVerifyEmail() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk konfirmasi OTP
  const handleConfirmOtp = async (email, code) => {
    setLoading(true);
    try {
      await confirmVerificationEmail({ email, code });
      toast.success('Email verified. Please sign in.');
      navigate('/login', { replace: true });
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Invalid or expired OTP';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk kirim ulang OTP
  const handleResendOtp = async (email) => {
    if (!email) {
      toast.error('Email is required to resend code');
      return;
    }
    
    try {
      await sendVerificationEmail(email);
      toast.success('Verification code sent');

    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to resend code';
      toast.error(errMsg);
    }
  };

  return { handleConfirmOtp, handleResendOtp, loading };
}