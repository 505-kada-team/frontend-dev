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
      toast.error(result.error);
    }
  };

  return { handleLoginSubmit, loading };
}
