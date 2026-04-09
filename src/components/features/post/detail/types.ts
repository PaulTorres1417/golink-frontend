
export type CommentSubscription = {
  commentRepost: {
    id: string;
    count_repost: number
  }
}

interface User {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface Comment {
  __typename: "Comment";
  id: string;
  content: string;
  user_id: User;
  post_id: {
    id: string;
    content: string;
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

interface CommentEdge {
  node: Comment;
  cursor: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

interface CommentConnection {
  __typename: "CommentConnection";
  edges: CommentEdge[];
  pageInfo: PageInfo;
}

export interface CommentsByPostQuery {
  commentsByPost: CommentConnection;
}

export interface RepliesByCommentQuery {
  repliesByComment: CommentConnection;
}

export type CreateCommentProps = {
  createComment: Comment;
};

export type CreateReplyProps = {
  createReply: Comment;
};

export type CommentDetail = {
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
export type CommentProps = {
  comment: CommentDetail;
}

