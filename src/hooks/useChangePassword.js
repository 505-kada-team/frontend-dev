import { useState } from "react";
import { changePassword } from "@/services/auth.services";

export function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (data) => {
    try {
      setIsLoading(true);

      return await changePassword(data);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleChangePassword,
    isLoading,
  };
}