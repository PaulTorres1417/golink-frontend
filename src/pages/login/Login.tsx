import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import type { LoginData, LoginVariable } from './types';
import { LOGIN_MUTATION } from './types';
import { useAuthStore } from '@/store/auth';
import {
  BackgroundPattern, BrandName, BrandSection, BrandTagline, Button, ButtonIcon,
  Container, ContentWrapper, Divider, DividerLine, DividerText, FooterText, ForgotLink,
  Form, FormCard, FormHeader, GlowEffect, Input, InputGroup, InputIcon, InputWrapper,
  Label, LabelRow, SignUpLink, SocialButton, SocialButtons, Title, WelcomeText, Imagen
} from "./Login.styles";
import {
  ArrowIcon, GithubIcon, GoogleIcon, LockIcon, MailIcon, TwitterIcon,
} from "./Login.icons";
import loginhero from '../../../public/loginhero.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useMutation<LoginData, LoginVariable>(LOGIN_MUTATION);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const currentBodyBg = document.body.style.background;

    document.documentElement.setAttribute('data-theme', 'light');
    document.body.style.background = '#ffffff';

    return () => {
      if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      document.body.style.background = currentBodyBg;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ variables: { email, password } });
      const token = result.data?.login.token;
      const user = result.data?.login.user;

      if (!token || !user) throw new Error('No se recibio user o token');
      setAuth(user, token);
      navigate('/');

    } catch (error) {
      console.error('Error al loguearse', error);
      throw new Error('Error al loguearse');
    }
  };

  return (
    <Container>
      <BackgroundPattern />
      <GlowEffect className="glow-1" />
      <GlowEffect className="glow-2" />

      <ContentWrapper>
        <BrandSection>
          <BrandName><span>GO</span>LINX</BrandName>
          <BrandTagline>Conecta con personas, comparte tu trabajo y crea oportunidades.</BrandTagline>
          <Imagen>
            <img src={loginhero} alt="" />
          </Imagen>
        </BrandSection>

        <FormCard>
          <FormHeader>
            <WelcomeText>Bienvenido de nuevo</WelcomeText>
            <Title>Accede a tu cuenta</Title>
          </FormHeader>

          <Form onSubmit={handleLogin}>
            <Field
              label="Correo electrónico"
              icon={MailIcon}
              input={
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com"
                  required
                />
              }
            />

            <Field
              label={
                <LabelRow>
                  <Label>Contraseña</Label>
                  <ForgotLink>¿Olvidaste tu contraseña?</ForgotLink>
                </LabelRow>
              }
              icon={LockIcon}
              input={
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              }
            />
            <Button type="submit">
              Iniciar Sesión
              <ButtonIcon>
                {ArrowIcon}
              </ButtonIcon>
            </Button>
          </Form>

          <Divider>
            <DividerLine />
            <DividerText>o continúa con</DividerText>
            <DividerLine />
          </Divider>

          <SocialButtons>
            <SocialButton type="button">{GoogleIcon}</SocialButton>
            <SocialButton type="button">{TwitterIcon}</SocialButton>
            <SocialButton type="button">{GithubIcon}</SocialButton>
          </SocialButtons>

          <FooterText>
            ¿No tienes cuenta? <SignUpLink>Regístrate aquí</SignUpLink>
          </FooterText>
        </FormCard>
      </ContentWrapper>
    </Container>
  );
}

const Field = ({ label, icon, input }: {
  label: React.ReactNode;
  icon: React.ReactNode;
  input: React.ReactNode;
}) => {
  return (
    <InputGroup>
      {typeof label === "string" ? <Label>{label}</Label> : label}
      <InputWrapper>
        <InputIcon>{icon}</InputIcon>
        {input}
      </InputWrapper>
    </InputGroup>
  );
}