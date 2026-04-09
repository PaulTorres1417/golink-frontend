import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PostQueryProps } from "@features/post/types";

type SavedPostType = {
  savedPost: PostQueryProps[];
  addSavedPosts: (post: PostQueryProps[]) => void;
  addPost: (post: PostQueryProps) => void;
  removeSavedPost: (id: string) => void;
  clearSavedPost: () => void;
}
export const useSavedPostStore = create<SavedPostType>()(
  persist(
    (set) => ({
      savedPost: [],
      addSavedPosts: (post) => set((state) => ({
        savedPost: [...state.savedPost, ...post]
      })),
      removeSavedPost: (id) => set((state) => ({
        savedPost: state.savedPost.filter(post => post.id !== id)
      })),
      addPost: (post) => set((state) => ({
        savedPost: [...state.savedPost, post]
      })),
      clearSavedPost: () => set({ savedPost: []})
    }),
    { name: ' saved-posts' }
  )
);
