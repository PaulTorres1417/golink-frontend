export type CommentTypeProps = {
  commentsByPost: {
    __typename?: string;
    edges: {
      node: {
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
        comments: number;
        view_count: number;
        reactions: number;
        initialReaction: boolean;
        has_viewed: boolean;
        created_at: string;
        isSaved: boolean;
        count_repost: number;
        isRepost: boolean;
      };
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    }
  }
}

export type PostDataProps = {
  getPostById: {
    id: string;
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
    created_at: string;
    initialReaction: boolean;
    countReaction: number;
    comments: number;
    view_count: number; 
    has_viewed: boolean;         
    isSaved: boolean; 
    count_repost: number;
    isRepost: boolean;
  }
}

export type PostDataVars = {
  id: string;
}

export type CommentAddedSubscription = {
  commentAdded: CommentProps;
};

export type CommentProps = {
    id: string;
    content: string;
    parent_id?: string | null;
    post_id: {
      id: string;
      content: string;
    };
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

export type ReactionCommentSubscription = {
  reactionComment: {
    id: string;
    comment_id: {
      id: string;
    };
    user_id: {
      id: string;
    };
    action: string;
  }
}

export type ViewCommentSubscription = {
  commentViewed: {
    id: string;
    user_id: {
      id: string;
    };
    view_count: number;
  }
}

export type CommentsCountSubscription = {
  commentsCount: {
    id: string;
    user_id: {
      id: string;
      name: string;
      avatar?: string | null;
    };
    comments: number;
  }
}

export type PostCommentCountSubscription = {
  postCommentsCount: {
    id: string;
    comments: number;
  }
}

export type ReplyCommentProps = {
  repliesByComment: {
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
        post_id: {
          __typename: string;
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
      };
      cursor: string;
    }[];
    pageInfo: {
      __typename: string;
      endCursor: string;
      hasNextPage: boolean;
    }
  }
}

export type ReplyCommentVars = {
  commentId: string | undefined;
  first: number;
  after?: string;
}