import { MdErrorOutline } from "react-icons/md";
import {
  BackgroundPattern, BrandName, BrandSection, BrandTagline, Button, ButtonIcon, MessageGlobal,
  Container, ContentWrapper, Divider, DividerLine, DividerText, FooterText, ForgotLink,
  Form, FormCard, FormHeader, Input, InputGroup, InputIcon, InputWrapper, ErrorMsg,
  Label, LabelRow, SignUpLink, SocialButton, SocialButtons, Title, WelcomeText, Video
} from "./styles";
import {
  ArrowIcon, GithubIcon, GoogleIcon, LockIcon, MailIcon,
} from '@/assets/icon/Icon';
import { ModalRegister } from '@components/features/register/ModalRegister';
import { Spinner } from '@/components/ui';
import { useForceDarkMode } from '@/hooks/ui/useForceDarkMode';
import { useLoginAuth } from '@/hooks/auth/useLoginAuth';
import { useNavigate } from "react-router-dom";

export default function Login() {
  useForceDarkMode();
  const { handleGithub, handleGoogle, 
    errors, globalError, handleSubmit, loading, setEmail, 
    setPassword, setShowRegister, showRegister, setErrors, email, password } = useLoginAuth();
  const navigate = useNavigate();


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
            <video autoPlay muted playsInline preload="auto" poster="/hero.png">
              <source src="/hero.mp4" type="video/mp4" {...{ fetchPriority: "high" }} />
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

          <Form onSubmit={handleSubmit} noValidate>
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
              {loading ? <Spinner color={'#fff'} /> : 'Sign in'}
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