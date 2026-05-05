import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import type { ResetPasswordProps } from "./types";
import { RESET_PASSWORD } from "@/graphql/mutation/auth/resetPassword";

export const useResetPassword = (token: string | null) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetPasword, { loading }] = useMutation<ResetPasswordProps>(RESET_PASSWORD);

  const validatePassword = () => {
    if (password.trim() === '') {
      setError('Password is required');
      return false;
    }
    if (password.trim().length < 6) {
      setError('Minimum 6 characters')
      return false;
    }
    return true;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setMessage("");
    setError("");

    try {
      const { data } = await resetPasword({ variables: { password, token } });
      if (!data) {
        setError("No se recibió respuesta del servidor.");
        return;
      }
      setMessage(data.resetPassword.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message;
      setError(message || "Error de red. Verifica tu conexión.");
    }
  };

  return { handleSubmit, error, loading, message, password, setPassword };
}