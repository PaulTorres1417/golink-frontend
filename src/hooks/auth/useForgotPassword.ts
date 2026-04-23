import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import type { ForgotPasswordProps } from "./types";
import { FORGOT_PASSWORD } from "@/graphql/mutation/auth/forgotPassword";

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [forgotPassword, { loading }] = useMutation<ForgotPasswordProps>(FORGOT_PASSWORD);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("El correo es requerido.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Correo inválido. Asegúrate de escribirlo correctamente.");
      return;
    }

    try {
      const { data } = await forgotPassword({ variables: { email } });
      if (!data) {
        setError("No se recibió respuesta del servidor.");
        return;
      }
      setMessage(data.forgotPassword.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { setEmail, email, message, error, loading, handleSubmit, navigate };
}