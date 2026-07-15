import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "@/services/auth.services";
import toast from "react-hot-toast";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (
    e,
    name,
    email,
    password,
    confirmPassword,
  ) => {
    e.preventDefault();

    // Validasi input password
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Panggil fungsi register dari service-mu
      await register({ name, email, password });

      toast.success("Registration successful! Please verify your email.");

      // Arahkan ke verify-email dan bawa data email di dalam 'state'
      navigate("/verify-email", { state: { email } });
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || "Failed to register";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { handleRegisterSubmit, loading };
}
