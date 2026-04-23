import styled from "styled-components";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { Spinner } from "@/components/ui";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

export default function ForgotPassword() {
  const { handleSubmit, navigate, error, 
    loading, message, email, setEmail} = useForgotPassword();

  return (
    <Overlay>
      <ModalCard>
        <BackButton onClick={() => navigate(-1)}>
          <IoIosArrowBack size={20} />
        </BackButton>
        <ModalHeader>
          <Title>Forgot your password?</Title>
          <Parrafo>
            Enter the email address associated with your account to change your password.
          </Parrafo>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            {
              message ? (
                <ContentMessage>
                  <SuccessMsg>{message}</SuccessMsg>
                  <IconContain><MdOutlineMarkEmailRead size={40} /></IconContain>
                </ContentMessage>
              ) : (
                <InputWrapper>
                  <InputIcon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </InputIcon>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    maxLength={50}
                    value={email}
                    $error={!!error}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputWrapper>
              )
            }
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </FieldGroup>
          {
            !message && (
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner color={'#fff'}/> : "Continue"}
              </Button>
            )
          }
        </Form>
      </ModalCard>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #131420;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 100;
  padding: 20px;
`;

const ModalCard = styled.div`
  background: #131420;
  border-radius: 24px;
  border: 1px solid #4b4e6b4f;
  padding: 40px;
  width: 100%;
  margin-top: 80px;
  max-width: 550px;
  position: relative;

  @media (max-width: 480px) {
    padding: 24px 20px;
    border-radius: 20px;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 10px;
  padding: 15px 2px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #fff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Parrafo = styled.p`
  font-size: 15px;
  color: #64748b;
  margin-top: 13px;
  letter-spacing: 0.3px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: 13px 14px 13px 44px;
  font-size: 15px;
  color: #fff;
  background: #000;
  border-radius: 12px;
  transition: border-color 0.2s;
  letter-spacing: 0.3px;
  border: 1px solid ${({ $error }) => ($error ? "#ef4444" : "#9cb3d158")};

  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? "#ef4444" : "#3b82f6")};
  }
  &:hover:not(:focus) {
    border: 1px solid ${({ $error }) => ($error ? "#ef4444" : "#9cb3d176")};
  }
  &::placeholder {
    color: #8696acff;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 50px;
  margin-top: 4px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(120deg, #407ddf 0%, #7453d6 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1));
    opacity: 0;
    transition: opacity 0.3s;
  }
  &:hover {
    transform: translateY(-2px);
  }
  &:hover::before {
    opacity: 1;
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMsg = styled.span`
  font-size: 11px;
  color: #ef4444;
  font-weight: 500;
  margin-top: -2px;
`;

const ContentMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 17px 0px;
  gap: 12px;
  border-radius: 12px;
  background: #08483345;
`;

const SuccessMsg = styled.span`
  font-size: 15px;
  color: #10b981;
  font-weight: 500;
  margin-top: -2px;
`;

const IconContain = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981
`;

const BackButton = styled.button`
  position: relative;
  right: 15px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  margin-bottom: 20px;
  transition: background 0.2s;

  &:hover {
    background: #ffffff15;
  }
`;