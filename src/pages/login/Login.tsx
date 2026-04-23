import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import type { LoginData, LoginVariable } from './types';
import { LOGIN_MUTATION } from './types';
import { MdErrorOutline } from "react-icons/md";
import { useAuthStore } from '@/store/auth';
import {
  BackgroundPattern, BrandName, BrandSection, BrandTagline, Button, ButtonIcon, MessageGlobal,
  Container, ContentWrapper, Divider, DividerLine, DividerText, FooterText, ForgotLink,
  Form, FormCard, FormHeader, Input, InputGroup, InputIcon, InputWrapper, ErrorMsg,
  Label, LabelRow, SignUpLink, SocialButton, SocialButtons, Title, WelcomeText, Video
} from "./styles";
import {
  ArrowIcon, GithubIcon, GoogleIcon, LockIcon, MailIcon,
} from '@/assets/icon/Icon';
import loginhero from '@public/hero.mp4';
import { TokenStore } from '@/store/auth/tokenStore';
import { ModalRegister } from '@components/features/register/ModalRegister';
import { Spinner } from '@/components/ui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [globalError, setGlobalError] = useState<string>('');
  const [login, { loading }] = useMutation<LoginData, LoginVariable>(LOGIN_MUTATION);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const currentBodyBg = document.body.style.background;

    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.style.background = '#131420';

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
    if (!validate()) return;
    setErrors({});
    setGlobalError('');
    try {
      const { data } = await login({ variables: { email, password } });

      if (data?.login.user && data.login.token) {
        TokenStore.set(data.login.token);
        setUser(data.login.user);
      }
      navigate('/');

    } catch (error: any) {
      const gqlError = error?.graphQLErrors?.[0];
      if (gqlError && gqlError.extensions?.field) {
        setErrors((prev) => ({
          ...prev,
          [gqlError.extensions.field]: gqlError.message,
        }));
      } else {
        setGlobalError(
          gqlError?.message || error?.message || 'Something went wrong'
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

  const handleClickForgot = () => {
    navigate('/forgot-password');
  }
  return (
    <Container>
      <BackgroundPattern />

      <ContentWrapper>
        <BrandSection>
          <BrandName><span>GO</span>LINX</BrandName>
          <BrandTagline>Connect with people, share your work and create opportunities.</BrandTagline>
          <Video>
            <video autoPlay muted playsInline preload="auto">
              <source src={loginhero} type="video/mp4" />
            </video>
          </Video>
        </BrandSection>

        <FormCard>
          <MessageGlobal $visible={!!globalError}>
            <MdErrorOutline size={20} />
            <span>Invalid credentials</span>
          </MessageGlobal>
          <FormHeader>
            <Title>Sign in</Title>
            <WelcomeText>New user?
              <SignUpLink onClick={() => setShowRegister(true)}>
                {' '}Create an account
              </SignUpLink>
            </WelcomeText>
          </FormHeader>

          <Form onSubmit={handleLogin} noValidate>
            <Field
              icon={<MailIcon />}
              input={
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="Email address"
                  $error={!!errors.email}
                />
              }
              footer={errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
            />

            <Field
              icon={<LockIcon />}
              input={
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  placeholder="Password"
                  $error={!!errors.password}
                />
              }
              footer={
                <>
                  {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
                  <LabelRow>
                    <ForgotLink onClick={handleClickForgot}>Forgot password?</ForgotLink>
                  </LabelRow>
                </>
              }
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner color={'#fff'}/> : 'Sign in'}
              {
                !loading && (
                  <ButtonIcon>
                    <ArrowIcon />
                  </ButtonIcon>
                )
              }
            </Button>
          </Form>

          <Divider>
            <DividerLine />
            <DividerText>or</DividerText>
            <DividerLine />
          </Divider>

          <SocialButtons>
            <SocialButton type="button" onClick={handleGoogle}>
              <span className="icon">{<GoogleIcon />}</span>
              <p>Register with Google</p>
            </SocialButton>

            <SocialButton type="button" onClick={handleGithub}>
              <span className="icon">{<GithubIcon />}</span>
              <p>Register with Github</p>
            </SocialButton>

          </SocialButtons>

          <FooterText>
            By signing in, you agree to our<br />
            <span>Terms of Service</span>{" "}
            and{" "}
            <span>Privacy Policy.</span>
          </FooterText>
        </FormCard>
      </ContentWrapper>
      {
        <ModalRegister
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      }
    </Container>
  );
}

const Field = ({
  label,
  icon,
  input,
  footer,
}: {
  label?: React.ReactNode;
  icon: React.ReactNode;
  input: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <InputGroup>
      {label && (typeof label === "string" ? <Label>{label}</Label> : label)}

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <InputWrapper>
          <InputIcon>{icon}</InputIcon>
          {input}
        </InputWrapper>
        {footer && <div>{footer}</div>}
      </div>

    </InputGroup>
  );
};