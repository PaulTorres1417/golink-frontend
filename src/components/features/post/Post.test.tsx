import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Post } from './Post';
import type { PostQueryProps } from './types';

const usePostFeedMock = vi.fn();
vi.mock('@/hooks/post/usePostFeed', () => ({
  usePostFeed: () => usePostFeedMock(),
}));

vi.mock('@/components/ui', () => ({
  Spinner: () => <div>Spinner</div>,
  EmptyPosts: () => <div>EmptyPosts</div>,
  Avatar: ({ avatarUrl }: { avatarUrl?: string | null }) => <div>Avatar {avatarUrl ?? null}</div>,
}));

vi.mock('./PostContent', () => ({
  PostContent: ({ data }: { data: PostQueryProps }) => <div>PostContent {data.id}</div>,
}));

describe('Post feed list', () => {
  class IntersectionObserverMock implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
  }

  globalThis.IntersectionObserver = IntersectionObserverMock;

  it('shows spinner on initial loading', () => {
    usePostFeedMock.mockReturnValue({
      posts: [],
      isInitialLoading: true,
      error: null,
      isFetchingMore: false,
      handleObserver: vi.fn(),
    });

    render(<Post />);
    expect(screen.getByText('Spinner')).toBeInTheDocument();
  });

  it('shows error message when error', () => {
    usePostFeedMock.mockReturnValue({
      posts: [],
      isInitialLoading: false,
      error: { message: 'Boom' },
      isFetchingMore: false,
      handleObserver: vi.fn(),
    });

    render(<Post />);
    expect(screen.getByText('Error: Boom')).toBeInTheDocument();
  });

  it('shows EmptyPosts when no posts', () => {
    usePostFeedMock.mockReturnValue({
      posts: [],
      isInitialLoading: false,
      error: null,
      isFetchingMore: false,
      handleObserver: vi.fn(),
    });

    render(<Post />);
    expect(screen.getByText('EmptyPosts')).toBeInTheDocument();
  });

  it('renders posts and shows fetching-more spinner', () => {
    usePostFeedMock.mockReturnValue({
      posts: [
        { id: 'p1', user_id: { avatar: 'a1' } },
        { id: 'p2', user_id: { avatar: 'a2' } },
      ] as unknown as PostQueryProps[],
      isInitialLoading: false,
      error: null,
      isFetchingMore: true,
      handleObserver: vi.fn(),
    });

    render(<Post />);
    expect(screen.getByText('PostContent p1')).toBeInTheDocument();
    expect(screen.getByText('PostContent p2')).toBeInTheDocument();
    expect(screen.getAllByText(/Avatar/)).toHaveLength(2);
    expect(screen.getAllByText('Spinner').length).toBeGreaterThanOrEqual(1);
  });
});