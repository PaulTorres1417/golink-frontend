import type { PostQueryProps } from "@/components/features/post/types";

export interface FeedPostsData {
  feedPosts: {
    __typename?: string;
    edges: {
      node: PostQueryProps;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
  };
}

export type PostViewedSubscription = {
  postViewed: {
    id: string;
    view_count: number;
    user_id: {
      id: string;
    }
  }
}

export type ReactionPostSubscription = {
  reactionPost: {
    id: string;
    post_id: {
      id: string;
    };
    user_id: {
      id: string;
    };
    action: string;
  }
}

export type CreateViewProps = {
  createViewPost: {
    id: string;
    view_count: number;
    has_viewed: boolean;
  }
}

export type CreateViewVars = {
  postId: string;
}

export type PostRepostCount = {
  postRepost: {
    id: string;
    count_repost: number;
  }
}
