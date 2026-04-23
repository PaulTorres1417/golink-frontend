import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const CREATE_REGISTER = gql`
  mutation Create_Register($name: String!, $email: String!, $password: String!, $birthday: String) {
    register(name: $name, email: $email, password: $password, birthday: $birthday) {
      message
    }
  }
`;

type RegisterType = {
  register: { message: string }
}

const currentYear = new Date().getFullYear();

export const dayOptions = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1), label: String(i + 1),
}));

export const monthOptions = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
].map((m, i) => ({ value: String(i + 1), label: m }));

export const yearOptions = Array.from({ length: 100 }, (_, i) => ({
  value: String(currentYear - i), label: String(currentYear - i),
}));

export const useRegisterForm = (isOpen: boolean, onClose: () => void) => {
  const [Create_Register, { loading }] = useMutation<RegisterType>(CREATE_REGISTER);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [birth, setBirth] = useState({ day: "", month: "", year: "" });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (!birth.day || !birth.month || !birth.year) newErrors.birth = "Birth date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleBirthChange = (field: keyof typeof birth) => (v: string) => {
    setBirth(prev => ({ ...prev, [field]: v }));
    if (errors.birth) setErrors({ ...errors, birth: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const birthday = `${birth.year}-${birth.month.padStart(2, "0")}-${birth.day.padStart(2, "0")}`;
      const { data } = await Create_Register({ variables: { ...form, birthday } });
      if (data?.register) onClose();
    } catch (err: any) {
      console.error('Register error:', err.message);
      const gqlError = err?.graphQLErrors?.[0];
      if (gqlError?.extensions?.field) {
        setErrors(prev => ({
          ...prev,
          [gqlError.extensions.field]: gqlError.message
        }));
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setForm({ name: "", email: "", password: "" });
      setErrors({});
      setBirth({ day: "", month: "", year: "" });
    }
  }, [isOpen]);

  return {
    form, errors, birth, loading,
    handleChange, handleBirthChange, handleSubmit,
  };
};