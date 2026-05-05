import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/ui', () => ({
  Spinner: () => <div>Spinner</div>,
  EmptyPosts: () => <div>EmptyPosts</div>,
  Avatar: ({ avatarUrl }: { avatarUrl?: string | null }) => <div>Avatar {avatarUrl ?? null}</div>,
}));

const getDisplayNameMock = vi.fn((name: string) => name);
vi.mock('@/utils/user/user', () => ({
  getDisplayName: (name: string) => getDisplayNameMock(name),
}));

const useCommentInputMock = vi.fn();
vi.mock('@/hooks/comment/useCommentInput', () => ({
  useCommentInput: (args: { post: string, postId: string, parentCommentId: string }) => useCommentInputMock(args),
}));

import { CommentInput } from './CommentInput';
import type { PostQueryProps } from '../post/types';

describe('CommentInput', () => {
  it('disables Reply button when comment is empty', () => {
    useCommentInputMock.mockReturnValue({
      comment: '',
      setComment: vi.fn(),
      handleSend: vi.fn(),
      theme: 'dark',
      user: { name: 'Paul', avatar: 'a1' },
    });

    render(<CommentInput postId="p1" />);
    expect(screen.getByRole('button', { name: 'Reply' })).toBeDisabled();
  });

  it('calls setComment on typing and enables Reply button when non-empty', async () => {
    const setComment = vi.fn();
    useCommentInputMock.mockReturnValue({
      comment: 'hi',
      setComment,
      handleSend: vi.fn(),
      theme: 'dark',
      user: { name: 'Paul', avatar: 'a1' },
    });

    render(<CommentInput postId="p1" />);
    const input = screen.getByPlaceholderText(/post your reply/i);
    await userEvent.type(input, '!');

    expect(setComment).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Reply' })).not.toBeDisabled();
  });

  it('calls handleSend when clicking Reply', async () => {
    const handleSend = vi.fn();
    useCommentInputMock.mockReturnValue({
      comment: 'hello',
      setComment: vi.fn(),
      handleSend,
      theme: 'dark',
      user: { name: 'Paul', avatar: 'a1' },
    });

    render(<CommentInput postId="p1" />);
    await userEvent.click(screen.getByRole('button', { name: 'Reply' }));
    expect(handleSend).toHaveBeenCalled();
  });

  it('adds "to @name" in placeholder when replying to someone else', () => {
    useCommentInputMock.mockReturnValue({
      comment: '',
      setComment: vi.fn(),
      handleSend: vi.fn(),
      theme: 'dark',
      user: { name: 'Paul', avatar: 'a1' },
    });

    render(
      <CommentInput
        postId="p1"
        post={{ user_id: { name: 'Alice' }} as unknown as PostQueryProps }
      />
    );

    expect(screen.getByPlaceholderText('Post your reply to @Alice')).toBeInTheDocument();
  });
});

