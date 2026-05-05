import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const setUserMock = vi.fn();
vi.mock('@/store/auth', () => ({
  useAuthStore: (selector: (state: { setUser: typeof setUserMock }) => unknown) =>
    selector({ setUser: setUserMock }),
}));

const tokenSetMock = vi.fn();
vi.mock('@/store/auth/tokenStore', () => ({
  TokenStore: {
    set: (t: string) => tokenSetMock(t),
  },
}));

let mutationImpl: () => [ReturnType<typeof vi.fn>, { loading: boolean }];
vi.mock('@apollo/client/react', () => ({
  useMutation: () => mutationImpl(),
}));

import { useLoginAuth } from './useLoginAuth';

describe('useLoginAuth', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    setUserMock.mockReset();
    tokenSetMock.mockReset();
  });

  it('validates empty fields and does not call mutation', async () => {
    const loginFn = vi.fn();
    mutationImpl = () => [loginFn, { loading: false }];

    const { result } = renderHook(() => useLoginAuth());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
    });

    expect(loginFn).not.toHaveBeenCalled();
    expect(result.current.errors.email).toBeTruthy();
    expect(result.current.errors.password).toBeTruthy();
  });

  it('on success sets token, user and navigates home', async () => {
    const loginFn = vi.fn().mockResolvedValue({
      data: {
        login: {
          user: { id: '1', name: 'Paul', email: 'p@e.com', username: 'paul' },
          token: 't1',
        },
      },
    });
    mutationImpl = () => [loginFn, { loading: false }];

    const { result } = renderHook(() => useLoginAuth());

    act(() => {
      result.current.setEmail('p@e.com');
      result.current.setPassword('123456');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
    });

    expect(tokenSetMock).toHaveBeenCalledWith('t1');
    expect(setUserMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', name: 'Paul' })
    );
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('maps gql field error into errors[field]', async () => {
    const loginFn = vi.fn().mockRejectedValue({
      graphQLErrors: [
        { message: 'Invalid email', extensions: { field: 'email' } },
      ],
    });
    mutationImpl = () => [loginFn, { loading: false }];

    const { result } = renderHook(() => useLoginAuth());

    act(() => {
      result.current.setEmail('bad@e.com');
      result.current.setPassword('123456');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(navigateMock).not.toHaveBeenCalled();
  });
});