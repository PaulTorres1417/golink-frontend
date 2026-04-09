import type { CommentProps } from "../../../pages/post/types";

export type User = {
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  }
}

export interface GenerateUploadSignatureResponse {
  generateUploadSignature: {
    timestamp: number;
    signature: string;
    apikey: string;
    cloudName: string;
  };
}

export interface PostsByUserData {
  postsByUser: Post[];
}

export interface Post {
  id: string;
  content: string;
  user_id: {
    id: string;
    name: string;
    avatar?: string | null;
    email: string;
  };
  media?: {
    id: string;
    url: string;
    media_type: string;
  } | null;
}

export interface PostProps extends Omit<Post, 'user_id'> {
  clientId: string;
  user_id: Omit<Post['user_id'], 'email'>;
}

export interface CreatePostData{
  createPost: Post & {
    original_post?: Post | null;
    original_comment?: CommentProps | null;
    created_at: string;
    count_repost: number;
    isRepost: boolean;
  }
}

export interface PostsByUserVars {
  content: string;
  media?: {
    url: string
    media_type: string;
  } | null;
  originalPostId?: string | null;  
  originalCommentId?: string | null;
}

export interface PostQueryProps {
  id: string;
  clientId: string;
  content: string;
  user_id: {
    id: string;
    avatar?: string | null;
    name: string;
    email: string;
    bio?: string | null;
    coverphoto?: string | null;
  };
  media?: {
    id: string;
    url: string;
    media_type: string;
  } | null;
  original_post: Post | null;
  original_comment: CommentProps | null;
  created_at: string;
  countReaction: number;
  initialReaction: boolean;
  comments: number;
  view_count: number;
  has_viewed: boolean;
  isSaved: boolean;
  count_repost: number;
  isRepost: boolean;
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

export type PostViewedSubscription = {
  postViewed: {
    id: string;
    view_count: number;
    user_id: {
      id: string;
    }
  }
}

export type PostRepostCount = {
  postRepost: {
    id: string;
    count_repost: number;
  }
}

export type CommentType = {
  kind: 'Comment';
  id: string;
  content: string;
  post_id: {
    id: string;
    content: string;
  };
  parent_id?: string | null;
  user_id: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
  created_at: string;
  comments: number;
  reactions: number;
  initialReaction: boolean;
  view_count: number;
  has_viewed: boolean;
  isSaved: boolean;
  count_repost: number;
  isRepost: boolean;
}

export type PostType = {
  kind: 'Post';
  id: string;
  clientId: string;
  content: string;
  user_id: {
    id: string;
    avatar?: string | null;
    name: string;
    email: string;
  };
  media?: {
    id: string;
    url: string;
    media_type: string;
  } | null;
  original_post: Post | null;
  original_comment: CommentProps | null;
  created_at: string;
  countReaction: number;
  initialReaction: boolean;
  comments: number;
  view_count: number;
  has_viewed: boolean;
  isSaved: boolean;
  count_repost: number;
  isRepost: boolean;
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