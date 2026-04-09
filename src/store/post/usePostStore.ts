import { create } from 'zustand';
import type { PostQueryProps } from '@features/post/types';


interface PostsState {
  posts: PostQueryProps[],
  addPost: (post: PostQueryProps) => void;
  updatePost: (tempId: string, posts: PostQueryProps) => void;
  appendPosts: (posts: PostQueryProps[]) => void;
  resentPosts: () => void;
  updatePostCommentCount: (postId: string, increment: number) => void;
  updatePostFields: (postId: string, updates: Partial<PostQueryProps>) => void;
  removePost: (postId: string) => void;
}

export const usePostStore = create<PostsState>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  resentPosts: () => set({ posts: [] }),
  appendPosts: (newPosts) =>
    set((state) => {
      const currentPost = [...state.posts];
      const existingIds = new Set(
        state.posts.flatMap((p) =>
          [p.id, p.clientId].filter(Boolean)
        )
      );
      const filteredPosts = newPosts.filter(post => !existingIds.has(post.id));
      return {
        posts: [...currentPost, ...filteredPosts]
      };
    }),
  updatePost: (tempId, newPost) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== tempId) return post;
        return {
          ...newPost,
          id: tempId,
        };
      }),
    })),
  updatePostFields: (postId, updates) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId || post.clientId === postId
          ? { ...post, ...updates }
          : post
      ),
    })),
  updatePostCommentCount: (postId, increment) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId || post.clientId === postId
          ? { ...post, comments: (post.comments || 0) + increment }
          : post
      ),
    })),
  removePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId)
    })),
}))