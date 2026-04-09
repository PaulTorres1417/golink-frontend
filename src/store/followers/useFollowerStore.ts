import { create } from 'zustand';
import type { Notification } from '../notifications/types';

type PageInfo = {
  endCursor: string | null;
  hasNextPage: boolean
}

type FollowerProps = {
  followers: Notification[];
  followerCount: number;
  pageInfoFollower: PageInfo | null;
  addAllFollowers: (followers: Notification[]) => void;
  addFollowerSubscription: (follower: Notification) => void;
  addFollowerFetchMore: (followers: Notification[]) => void;
  resetCount: () => void;
  setPageInfoFollower: (pageInfo: PageInfo) => void
}

export const useFollowerStore = create<FollowerProps>((set) => ({
  followers: [],
  followerCount: 0,
  pageInfoFollower: null,

  addAllFollowers: (followers) => set(() => {
    return {
      followers: [...followers],
      followerCount: followers.filter(f => !f.read).length
    }
  }),
  addFollowerSubscription: (follower) => set((state) => {
    const existing = state.followers.some(f => f.id === follower.id);
    if (existing) return state;
    return {
      followers: [follower, ...state.followers],
      followerCount: state.followerCount + 1
    }
  }),
  addFollowerFetchMore: (followers) => set((state) => {
    const existingIds = new Set(state.followers.map(f => f.id));
    const newFollower = followers.filter(f => !existingIds.has(f.id));
    return {
      followers: [...state.followers, ...newFollower],
      followerCount: newFollower.filter(f => !f.read).length
    }
  }),
  resetCount: () => set({ followerCount: 0 }),
  setPageInfoFollower: (pageInfo) => set({ pageInfoFollower: pageInfo })
}))

