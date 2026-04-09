import styled, { css } from "styled-components";

const bp = {
  sm: 768,
  md: 968,
  xs: 360,
} as const;

const down =
  (px: number) =>
    (strings: TemplateStringsArray, ...interpolations: any[]) =>
      css`
      @media (max-width: ${px}px) {
        ${css(strings, ...interpolations)}
      }
    `;

const sm = down(bp.sm);
const md = down(bp.md);
const xs = down(bp.xs);

export const Container = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 20px;
  background: #000;

  ${sm`
    padding: 16px;
  `}
`;

export const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  z-index: -1;
`;

export const GlowEffect = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  pointer-events: none;

  &.glow-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
    top: -10%;
    left: -10%;
  }

  &.glow-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
    bottom: -10%;
    right: -10%;
  }

  ${sm`
    &.glow-1, &.glow-2 {
      width: 300px;
      height: 300px;
    }
  `}
`;

export const ContentWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1100px;
  width: 100%;
  gap: 40px;
  align-items: center;

  ${md`
    grid-template-columns: 1fr;
    gap: 40px;
    max-width: 480px;
  `}
`;

export const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #fff;
  padding: 15px;
 

  ${md`
    text-align: center;
    padding: 20px;
    display: none;
  `}
`;
export const Imagen = styled.div`
  width: 100%;
  height: 100%;
  
  img {
    width: 100%;
    height: 100%;
  }
`;

export const BrandName = styled.h1`
  font-size: 60px;
  font-family: "Nunito", sans-serif;
  font-optical-sizing: auto;
  font-weight: 800;
  font-style: normal;
  margin-bottom: 12px;
  background: linear-gradient(120deg, #5484b4ff 0%, #0151ffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  font-style: normal;

  span {
  display: inline-block; 
  background: linear-gradient(120deg, #407ddfff 0%, #7453d6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
  ${sm`
    font-size: 36px;
  `}
`;

export const BrandTagline = styled.p`
  font-size: 22px;
  color: #fff;
  font-weight: 200;

  ${sm`
    font-size: 16px;
  `}
`;

export const FormCard = styled.div`
  position: relative;
  background: #000;
  backdrop-filter: blur(20px);
  padding: 48px;
  border-radius: 24px;
  border: 1px solid #595d6284;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.1),
    0 10px 20px -5px rgba(0, 0, 0, 0.05);

  ${sm`
    padding: 32px 24px;
    border-radius: 20px;
  `}

  ${xs`
    padding: 24px 20px;
  `}
`;

export const FormHeader = styled.div`
  margin-bottom: 32px;

  ${sm`
    margin-bottom: 24px;
  `}
`;

export const WelcomeText = styled.p`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;

  ${sm`
    font-size: 13px;
  `}
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0;

  ${sm`
    font-size: 24px;
  `}

  ${xs`
    font-size: 22px;
  `}
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${sm`
    gap: 20px;
  `}
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #7d8da2ff;
  letter-spacing: 0.3px;

  ${sm`
    font-size: 13px;
  `}
`;

export const ForgotLink = styled.a`
  font-size: 13px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }

  ${sm`
    font-size: 12px;
  `}
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

export const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  font-size: 15px;
  color: #fff;
  background: #000;
  border: 1px solid #595d6284;
  border-radius: 12px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    background: #000;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  ${sm`
    padding: 13px 14px 13px 46px;
    font-size: 16px;
  `}
`;

export const Button = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 8px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: #000;
  border: 1px solid #64748b;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
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

  ${sm`
    padding: 14px;
    font-size: 15px;
  `}

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

  ${sm`
    margin: 24px 0 20px;
  `}
`;

export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #595d6284;
`;

export const DividerText = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`;

export const SocialButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

export const SocialButton = styled.button`
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #ffffff;
    border-color: #94a3b8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }
`;

export const FooterText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #64748b;
  margin: 0;

  ${sm`
    font-size: 13px;
  `}
`;

export const SignUpLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

