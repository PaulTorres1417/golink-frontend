
export type TrendingQuery = {
  getTrendingPosts: Trending[];
}

type Trending = {
  id: string;
  content: string;
  created_at: string;
  countReaction: number;
  reaction_avatars: string[];
  count_repost: number;
  user_id: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
  media?: {
    id: string;
    url: string;
    media_type: string;
  } | null;
}

export type TrendingCard = {
  post: Trending;
}