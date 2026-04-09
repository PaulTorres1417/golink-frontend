
export type Notification = {
  id: string;
  actor_id: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  type: string;
  reference_id: string;
  reference_type: string;
  read: boolean;
  created_at: string;
};

export type PageInfo = {
  endCursor: string | null;
  hasNextPage: boolean;
};

export type NotificationState = {
  notifications: Notification[];
  notificationsCount: number;
  pageInfo: PageInfo | null;
};

export type NotificationEdge = {
  node: Notification;
  cursor: string;
}