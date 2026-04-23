import type { PostQueryProps } from "../post/types";

export type CommentType = {
  comment: {
    id: string;
    content: string;
    user_id: {
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
    };
    post_id: {
      id: string;
      content: string;
    }
    created_at: string;
    comments: number;
    reactions: number;
    initialReaction: boolean;
    view_count: number;
    has_viewed: boolean;
    isSaved: boolean;
    count_repost: number;
    isRepost: boolean;
  };
  post?: {
    id: string;
    content: string;
    user_id: {
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
    };
    created_at: string;
    media?: {
      url: string;
      media_type: string;
    } | null;
  };
}

export type CommentInputProps = {
  post?: PostQueryProps | CommentType;
  postId: string;
  parentCommentId?: string | null;
}

export type CreateCommentResponse = {
  createComment: {
    __typename: string;
    id: string;
    content: string;
    user_id: {
      __typename: string;
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
    };
    post_id: {
      id: string;
      content: string;
    };
    comments: number;
    reactions: number;
    initialReaction: boolean;
    view_count: number;
    has_viewed: boolean;
    created_at: string;
    isSaved: boolean;
    count_repost: number;
    isRepost: boolean;
  }
}

export type CreateCommentVar = {
  postId: string;
  content: string;
  parentCommentId?: string | null;
}

export type Comment = {
  __typename: string;
  edges: {
    __typename: string;
    node: {
      __typename: string;
      id: string;
      content: string;
      user_id: {
        __typename: string;
        id: string;
        name: string;
        email: string;
        avatar?: string | null;
      };
      created_at: string;
      comments: number;
    };
    cursor: string;
  }[];
  pageInfo: {
    __typename: string;
    endCursor: string;
    hasNextPage: boolean;
  };
};

export type CommentsByPostData = {
  commentsByPost: Comment;
}
export type CommentsByReplyData = {
  repliesByComment: Comment;
}
