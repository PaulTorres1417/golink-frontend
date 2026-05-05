import { useAuthStore } from "@/store";
import { TokenStore } from "@/store/auth/tokenStore";
import { useMutation } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { VerifyProps } from "./types";
import { VERIFY_EMAIL } from "@/graphql/mutation/auth/verifyEmail";

export const useVerifyEmail = (token: string | null) => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const called = useRef(false);

  const [verifyEmail] = useMutation<VerifyProps>(VERIFY_EMAIL);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token inválido');
      return;
    }

    if (called.current) return;
    called.current = true;

    const verify = async () => {
      try {
        const { data } = await verifyEmail({ variables: { token } });
        if (!data) {
          setStatus('error');
          setMessage('No se recibió respuesta del servidor');
          return;
        }
        setUser(data.verifyEmail.user);
        TokenStore.set(data.verifyEmail.token);
        navigate('/home');
      } catch (error: unknown) {
        const message = (error as { message?: string })?.message;
        setStatus('error');
        setMessage(message || 'Error de red, verify conexion');
      }
    };
    verify();
  }, [token, verifyEmail, setUser, navigate]);

  return { status, message }

}