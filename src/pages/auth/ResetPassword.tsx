import styled from "styled-components";
import { FaLock } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";
import { LuKeyRound } from "react-icons/lu";
import { Spinner } from "@/components/ui";
import { useResetPassword } from "@/hooks/auth/useResetPassword";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { handleSubmit, error, loading, message, 
    password, setPassword } = useResetPassword(token);

  return (
    <Overlay>
      <ModalCard>
        <ModalHeader>
          <WelcomeText>{!message 
            ? 'Set a new password' 
            : 'successful change'}
          </WelcomeText>
          <Title>
            Reset password 
            <FaLock size={20}/>
          </Title>
          <Parrafo>
            {!message 
              ? 'Enter your new password below to update your account.'
              :'Your password has been successfully updated.'}
          </Parrafo>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            {
              message ? (
                <MessageContent>
                  <SuccessMsg>{message}</SuccessMsg>
                  <FaRegCheckCircle size={15} />
                </MessageContent>
              ) : (
                <InputWrapper>
                  <InputIcon>
                    <LuKeyRound />
                  </InputIcon>
                  <Input
                    type="text"
                    placeholder="Ingresa tu nueva contraseña"
                    maxLength={50}
                    value={password}
                    $error={!!error}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputWrapper>
              )
            }
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </FieldGroup>
          {
            !message && (
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner color={'#fff'}/> : "Reset password"}
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
  padding: 50px;
  width: 100%;
  border: 1px solid #4b4e6b4f;
  margin-top: 80px;
  max-width: 550px;
  position: relative;

  @media (max-width: 480px) {
    padding: 24px 20px;
    border-radius: 20px;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 20px;
`;

const WelcomeText = styled.p`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
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
  font-size: 14px;
  color: #ef4444;
  font-weight: 500;
  margin-top: -2px;
`;
const MessageContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #10b981;
`;

const SuccessMsg = styled.span`
  font-size: 15px;
  color: #10b981;
  font-weight: 500;
  margin-top: -2px;
`;
