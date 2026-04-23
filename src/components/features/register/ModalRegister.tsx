import { useEffect } from "react";
import { Mail, Lock, User, X, ArrowRight, Calendar, MailIcon } from "lucide-react";
import { CustomSelect } from './CustomSelect';
import { useRegisterForm, dayOptions, monthOptions, yearOptions } from '@/hooks/register/useRegisterForm';
import { Spinner } from "@/components/ui";
import {
  Overlay, ModalCard, CloseButton, ModalHeader, WelcomeText, Title,
  Form, FieldGroup, InputWrapper, InputIcon, Input,
  Button, BirthLabel, SelectRow, ErrorMsg,
  SuccessContainer,
  SuccessText,
  CloseBtn
} from "./styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export const ModalRegister = ({ isOpen, onClose }: Props) => {
  const { form, errors, birth, loading, success,
    handleChange, handleBirthChange, handleSubmit } = useRegisterForm(isOpen, onClose);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalCard>
        <CloseButton onClick={onClose}><X size={16} /></CloseButton>
        {
          success ? (
            <SuccessContainer>
              <MailIcon size={48} />
              <Title>Check your email</Title>
              <SuccessText>
                We sent you a confirmation link. Please verify your email to continue.
              </SuccessText>
              <CloseBtn onClick={onClose}>Got it</CloseBtn>
            </SuccessContainer>
          ) : (
            <>
              <ModalHeader>
                <WelcomeText>Publish and earn</WelcomeText>
                <Title>Sign up</Title>
              </ModalHeader>

              <Form onSubmit={handleSubmit} noValidate>
                <FieldGroup>
                  <InputWrapper>
                    <InputIcon><User size={16} /></InputIcon>
                    <Input 
                     placeholder="Name" 
                     $error={!!errors.name} 
                     value={form.name} 
                     maxLength={50} 
                     onChange={handleChange("name")} 
                    />
                  </InputWrapper>
                  {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
                </FieldGroup>

                <FieldGroup>
                  <BirthLabel><Calendar size={14} />Date of birth</BirthLabel>
                  <SelectRow>
                    <CustomSelect 
                     id="day" 
                     placeholder="Day" 
                     options={dayOptions} 
                     value={birth.day} 
                     $error={!!errors.birth} 
                     onChange={handleBirthChange("day")} 
                    />
                    <CustomSelect 
                     id="month" 
                     placeholder="Month" 
                     options={monthOptions} 
                     value={birth.month} 
                     $error={!!errors.birth} 
                     onChange={handleBirthChange("month")} 
                    />
                    <CustomSelect 
                     id="year" 
                     placeholder="Year" 
                     options={yearOptions} 
                     value={birth.year} 
                     $error={!!errors.birth} 
                     onChange={handleBirthChange("year")} 
                    />
                  </SelectRow>
                  {errors.birth && 
                    <ErrorMsg>{errors.birth}</ErrorMsg>}
                </FieldGroup>

                <FieldGroup>
                  <InputWrapper>
                    <InputIcon><Mail size={16} /></InputIcon>
                    <Input 
                     type="email" 
                     placeholder="Email" 
                     $error={!!errors.email} 
                     value={form.email} 
                     maxLength={100} 
                     onChange={handleChange("email")} 
                    />
                  </InputWrapper>
                  {errors.email && 
                    <ErrorMsg>{errors.email}</ErrorMsg>}
                </FieldGroup>

                <FieldGroup>
                  <InputWrapper>
                    <InputIcon><Lock size={16} /></InputIcon>
                    <Input 
                     type="password" 
                     placeholder="Password"
                     $error={!!errors.password} 
                     value={form.password} 
                     maxLength={50} 
                     onChange={handleChange("password")} 
                    />
                  </InputWrapper>
                  {errors.password && 
                    <ErrorMsg>{errors.password}</ErrorMsg>}
                </FieldGroup>

                <Button type="submit">
                  {loading ? <Spinner color="#fff" /> : 'Sign up'}
                  {!loading && <ArrowRight size={16} />}
                </Button>
              </Form>
            </>
          )
        }
      </ModalCard>
    </Overlay>
  );
};

