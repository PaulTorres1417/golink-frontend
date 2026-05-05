import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const forceDarkModeMock = vi.fn();
vi.mock('@/hooks/ui/useForceDarkMode', () => ({
  useForceDarkMode: () => forceDarkModeMock(),
}));

interface ModalRegisterProps {
  isOpen: boolean;
  onClose: () => void;
}

const modalRegisterSpy = vi.fn();
vi.mock('@components/features/register/ModalRegister', () => ({
  ModalRegister: (props: ModalRegisterProps) => {
    modalRegisterSpy(props);
    return props.isOpen ? <div>ModalRegister Open</div> : null;
  },
}));

const useLoginAuthMock = vi.fn();
vi.mock('@/hooks/auth/useLoginAuth', () => ({
  useLoginAuth: () => useLoginAuthMock(),
}));

import Login from './Login';

const defaultAuth = {
  handleGithub: vi.fn(),
  handleGoogle: vi.fn(),
  errors: {},
  globalError: '',
  handleSubmit: vi.fn((e: React.FormEvent) => e.preventDefault()),
  loading: false,
  setEmail: vi.fn(),
  setPassword: vi.fn(),
  setShowRegister: vi.fn(),
  showRegister: false,
  setErrors: vi.fn(),
  email: '',
  password: '',
};

describe('Login page', () => {
  it('renders fields and submit button', () => {
    useLoginAuthMock.mockReturnValue(defaultAuth);

    render(<Login />);

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
  });

  it('navigates to forgot-password when clicking link', async () => {
    useLoginAuthMock.mockReturnValue(defaultAuth);

    render(<Login />);
    await userEvent.click(screen.getByText('Forgot password?'));

    expect(navigateMock).toHaveBeenCalledWith('/forgot-password');
  });

  it('opens register modal when clicking Create an account', async () => {
    const setShowRegister = vi.fn();
    useLoginAuthMock.mockReturnValue({ ...defaultAuth, setShowRegister });

    render(<Login />);
    await userEvent.click(screen.getByText(/create an account/i));

    expect(setShowRegister).toHaveBeenCalledWith(true);
  });

  it('disables submit button when loading', () => {
    useLoginAuthMock.mockReturnValue({ ...defaultAuth, loading: true });

    render(<Login />);
    const submit = screen
      .getAllByRole('button')
      .find((b) => b.getAttribute('type') === 'submit');
    expect(submit).toBeTruthy();
    expect(submit).toBeDisabled();
  });
});