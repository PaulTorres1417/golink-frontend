import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import type { LoginData, LoginVariable } from './types';
import { useAuthStore } from '@/store/auth';
import { TokenStore } from '@/store/auth/tokenStore';
import { LOGIN_MUTATION } from '@/graphql/mutation/auth/loginAuth';

export const useLoginAuth = () => {
  const [login, { loading }] = useMutation<LoginData, LoginVariable>(LOGIN_MUTATION);
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string>('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Minimum 6 characters";

    setErrors(newErrors);
    setGlobalError('');
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});
    setGlobalError('');
    try {
      const { data } = await login({ variables: { email, password } });

      if (data?.login.user && data.login.token) {
        TokenStore.set(data.login.token);
        setUser(data.login.user);
      }
      navigate('/home');

    } catch (error: unknown) {
      const gqlError = (error as { graphQLErrors?: { message: string; extensions?: { field: string } }[] })
        ?.graphQLErrors?.[0];

      if (gqlError && gqlError.extensions?.field) {
        setErrors((prev) => ({
          ...prev,
          [gqlError.extensions!.field]: gqlError.message,
        }));
      } else {
        const message = (error as { message?: string })?.message;
        setGlobalError(
          gqlError?.message || message || 'Something went wrong'
        );
      }
    }
  };

  {/* OAuth */ }
  const handleGoogle = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };
  const handleGithub = () => {
    window.location.href = 'http://localhost:4000/auth/github';
  };

  return {
    handleGithub, handleGoogle, handleSubmit,
    setPassword, setEmail, setShowRegister, setErrors, password, email, showRegister,
    globalError, errors, loading
  }
}