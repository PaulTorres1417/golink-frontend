import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

let mutationImpl: () => [ReturnType<typeof vi.fn>, { loading: boolean }];
vi.mock('@apollo/client/react', () => ({
  useMutation: () => mutationImpl(),
}));

import { useRegisterForm } from './useRegisterForm';

describe('useRegisterForm', () => {
  beforeEach(() => {
    mutationImpl = () => [vi.fn(), { loading: false }];
  });

  it('validates required fields (including birth)', async () => {
    const mutate = vi.fn();
    mutationImpl = () => [mutate, { loading: false }];

    const { result } = renderHook(() => useRegisterForm(true));

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
    });

    expect(mutate).not.toHaveBeenCalled();
    expect(result.current.errors.name).toBeTruthy();
    expect(result.current.errors.email).toBeTruthy();
    expect(result.current.errors.password).toBeTruthy();
    expect(result.current.errors.birth).toBeTruthy();
  });

  it('submits with formatted birthday YYYY-MM-DD and sets success', async () => {
    const mutate = vi.fn().mockResolvedValue({ data: { register: { message: 'ok' } } });
    mutationImpl = () => [mutate, { loading: false }];

    const { result } = renderHook(() => useRegisterForm(true));

    await act(async () => {
      result.current.handleChange('name')({ target: { value: 'Paul' } } as unknown as React.ChangeEvent<HTMLInputElement>);
    });
    await waitFor(() => expect(result.current.form.name).toBe('Paul'));

    await act(async () => {
      result.current.handleChange('email')({ target: { value: 'paul@example.com' } } as unknown as React.ChangeEvent<HTMLInputElement>);
    });
    await waitFor(() => expect(result.current.form.email).toBe('paul@example.com'));

    await act(async () => {
      result.current.handleChange('password')({ target: { value: '123456' } } as unknown as React.ChangeEvent<HTMLInputElement>);
    });
    await waitFor(() => expect(result.current.form.password).toBe('123456'));

    await act(async () => {
      result.current.handleBirthChange('day')('2');
      result.current.handleBirthChange('month')('3');
      result.current.handleBirthChange('year')('2000');
    });

    await waitFor(() => {
      expect(result.current.birth).toEqual({ day: '2', month: '3', year: '2000' });
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
    });

    expect(mutate).toHaveBeenCalledWith({
      variables: {
        name: 'Paul',
        email: 'paul@example.com',
        password: '123456',
        birthday: '2000-03-02',
      },
    });
    expect(result.current.success).toBe(true);
  });
});