
export type Notification = {
  id: string;
  actor_id: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  }
  type: string;
  reference_id: string;
  reference_type: string;
  read: boolean;
  created_at: string;
}

type Pagination = {
  edges: {
    node: Notification;
    cursor: string;
  }[];
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean
  }
}

{/*  query types  */}

export type GetNotifiProps = {
  getNotifications: Pagination;
}

export type GetFollowerProps = {
  getFollowers: Pagination
}


{/*  susbcription types  */}

export type NotificationProps = {
  newFollower: Notification;
}

export type LikePostProps = {
  likePost: Notification;
}

export type LikeCommentProps = {
  likeComment: Notification;
}

export type RepostPostEventProps = {
  repostPostEvent: Notification;
}

export type RepostCommentEventProps = {
  repostCommentEvent: Notification;
}