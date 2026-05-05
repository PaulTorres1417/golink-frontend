import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const useRegisterFormMock = vi.fn();

interface CustomSelectProps {
  onChange?: (value: string) => void;
  placeholder?: string;
}

vi.mock('@/hooks/register/useRegisterForm', () => ({
  useRegisterForm: (...args: unknown[]) => useRegisterFormMock(...args),
  dayOptions: [{ value: '1', label: '1' }],
  monthOptions: [{ value: '1', label: 'Enero' }],
  yearOptions: [{ value: '2000', label: '2000' }],
}));

vi.mock('./CustomSelect', () => ({
  CustomSelect: (props: CustomSelectProps) => (
    <button type="button" onClick={() => props.onChange?.('1')}>
      {props.placeholder}
    </button>
  ),
}));

import { ModalRegister } from './ModalRegister';

const defaultForm = {
  form: { name: '', email: '', password: '' },
  errors: {},
  birth: { day: '', month: '', year: '' },
  loading: false,
  success: false,
  handleChange: () => () => {},
  handleBirthChange: () => () => {},
  handleSubmit: (e: React.FormEvent) => e.preventDefault(),
};

describe('ModalRegister', () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it('returns null when closed', () => {
    useRegisterFormMock.mockReturnValue(defaultForm);

    const { container } = render(<ModalRegister isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('calls onClose on Escape key', async () => {
    const onClose = vi.fn();
    useRegisterFormMock.mockReturnValue(defaultForm);

    render(<ModalRegister isOpen={true} onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows success view and navigates to /login after 5s', () => {
    vi.useFakeTimers();
    useRegisterFormMock.mockReturnValue({ ...defaultForm, success: true });

    render(<ModalRegister isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Check your email')).toBeInTheDocument();

    vi.advanceTimersByTime(5000);
    expect(navigateMock).toHaveBeenCalledWith('/');
    vi.useRealTimers();
  });
});