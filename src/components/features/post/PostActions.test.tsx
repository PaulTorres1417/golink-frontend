import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { PostQueryProps } from './types';

const toastSuccess = vi.fn();
vi.mock('react-hot-toast', () => ({
  default: { success: (...args: unknown[]) => toastSuccess(...args) },
}));

vi.mock('@/store', () => ({
  useTheme: () => ({ theme: 'dark' }),
  usePostStore: (selector: (state: { posts: { id: string; comments: number }[] }) => unknown) =>
    selector({
      posts: [{ id: 'p1', comments: 5 }],
    }),
}));

const toggleSavedMock = vi.fn().mockResolvedValue(undefined);
vi.mock('@/hooks/post', () => ({
  useSavedPost: () => ({ isSaved: false, toggleSaved: toggleSavedMock }),
  usePostReaction: () => ({ reaction: false, count: 1, onToggle: vi.fn() }),
}));

vi.mock('@/components/ui', () => ({
  HeartButton: ({ count }: { count: number }) => <button type="button">Heart {count}</button>,
  CommentIcon: () => <span>CommentIcon</span>,
  ViewsIcon: () => <span>ViewsIcon</span>,
  RepostIcon: () => <span>RepostIcon</span>,
}));

interface RepostModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const repostModalSpy = vi.fn();
vi.mock('./modals/RepostModalPost', () => ({
  RepostModalPost: (props: RepostModalProps) => {
    repostModalSpy(props);
    return <div>RepostModal</div>;
  },
}));

import { PostActions } from './PostActions';

const mockData = {
  id: 'p1',
  comments: 0,
  countReaction: 1,
  count_repost: 0,
  view_count: 0,
  isRepost: false,
} as unknown as PostQueryProps;

describe('PostActions', () => {
  it('shows comment count from store when available', () => {
    render(<PostActions initialReaction={false} data={mockData} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('opens repost modal when clicking repost action', async () => {
    render(<PostActions initialReaction={false} data={mockData} />);

    await userEvent.click(screen.getByText('RepostIcon'));
    expect(screen.getByText('RepostModal')).toBeInTheDocument();
    expect(repostModalSpy).toHaveBeenCalled();
  });

  it('toggles saved and shows toast on saved click', async () => {
    render(<PostActions initialReaction={false} data={mockData} />);

    const actions = document.querySelectorAll('[class*="saved"]');
    expect(actions.length).toBe(1);
    await userEvent.click(actions[0] as HTMLElement);

    expect(toggleSavedMock).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalled();
  });
});