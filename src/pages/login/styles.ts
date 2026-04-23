import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: flex;
  max-width: 1400px;
  margin: auto;
  height: 100vh;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 20px;
`;

export const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  background: #131420;
  z-index: -1;
`;



export const ContentWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100vh;
  gap: 20px;
  align-items: center;
  justify-content: space-evenly;

  @media (max-width: 950px) {
    justify-content: center;
    flex-direction: column;
    font-size: 35px;
    gap: 10px;
  }
`;

export const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  max-width: 650px;
  color: #fff;
  z-index: 100;
`;

export const MessageGlobal = styled.div<{ $visible: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #fc0303ff;
  background: #800f0f6b;
  margin-bottom: 15px;
  height: 50px;
  border-radius: 12px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transition: opacity 0.2s ease;
`;

export const Video = styled.div`
  width: 650px;
  height: 542px;
  overflow: visible;
  z-index: 1000;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (max-width: 950px) {
    display: none;
  }
`;

export const BrandName = styled.h1`
  font-size: 60px;
  font-family: "Nunito", sans-serif;
  font-optical-sizing: auto;
  font-weight: 900;
  margin-bottom: 8px;
  position: relative;
  top: 20px;
  margin-left: 4rem;
  background: linear-gradient(120deg, #5484b4ff 0%, #0151ffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.3px;

  span {
  display: inline-block; 
  background: linear-gradient(120deg, #407ddfff 0%, #7453d6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
`;

export const BrandTagline = styled.p`
  font-size: 22px;
  color: #fff;
  letter-spacing: 0.2px;
  margin-left: 4.3rem;
  font-weight: 200;
  position: relative;
  top: 20px;
  z-index: 3000;

  @media (max-width: 950px) {
    display: none;
  }
`;

export const FormCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #131420;
  width: 420px;
  min-width: 380px;
  padding: 15px 30px;
  border-radius: 24px;
  margin-bottom: 40px;
`;

export const FormHeader = styled.div`
  margin-bottom: 17px;
`;

export const WelcomeText = styled.p`
  font-size: 14px;
  color: #9cb3d1ff;
  font-weight: 500;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 7px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #7d8da2ff;
  letter-spacing: 0.3px;
`;

export const ForgotLink = styled.a`
  font-size: 14px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color 0.2s;
`;

export const Input = styled.input<{ $error: boolean }>`
  width: 100%;
  padding: 14px 16px 14px 48px;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #fff;
  background: #000;
  border: 1px solid ${({ $error }) => ($error ? "#ef4444" : "#9cb3d158")};
  border-radius: 12px;

  &::placeholder {
    color: #8696acff;
  }

  &:focus {
    outline: none;
    background: #000;
    border-color: #3b82f6;
  }
   &:hover:not(:focus) {
    border: 1px solid #9cb3d176;
  }
`;

export const Button = styled.button`
  width: 100%;
  height: 50px;
  margin-top: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(120deg, #407ddfff 0%, #7453d6ff 100%);
  border: 1px solid #3b82f6;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
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

  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }
`;

export const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
  transition: transform 0.3s;

  ${Button}:hover & {
    transform: translateX(4px);
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 32px 0 24px;
`;

export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #73777c5a;
`;

export const DividerText = styled.span`
  font-size: 13px;
  color: #7d8da2ff;
  font-weight: 500;
`;

export const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

export const SocialButton = styled.button`
  width: 100%;
  height: 40px;
  padding: 5px 16px;
  letter-spacing: 0.5px;
  font-family: Google Sans Text, Roboto, Arial, sans-serif;
  background: #000;
  border: 1px solid #9cb3d158;
  border-radius: 30px;
  color: #8696acff;
  cursor: pointer;
  font-size: 13px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;

  &:hover {
    background: #292b401c;
    border: 1px solid #9cb3d176;
    color: #fff;
  }
  .icon {
    display: flex;
    align-items: center;
    line-height: 0;
  }
`;

export const FooterText = styled.div`
  text-align: center;
  font-size: 13px;
  color: #8696acff;
  margin: 0;

  span {
    color: #3b82f6;
  }
`;

export const SignUpLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }
`;

export const ErrorMsg = styled.span`
  font-size: 11px;
  color: #ef4444;
  font-weight: 500;
  margin-top: -13px;
`;
