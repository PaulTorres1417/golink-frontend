import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/client/react';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { useNotificationStore } from '../../../store/notifications/useNotificationStore';
import { NOTIFICATIONS_FIELDS } from '../../../graphql/fragment/notification/notificationPostReaction';
import type { LikeCommentProps, LikePostProps, NotificationProps, RepostCommentEventProps, RepostPostEventProps } from './types';
import { useFollowerStore } from '../../../store/followers/useFollowerStore';

const NEW_FOLLOWER_SUB = gql`
  ${NOTIFICATIONS_FIELDS}
  subscription New_Follower($recipientId: ID!) {
    newFollower(recipientId: $recipientId) {
      ...NotificationsFields
    }
  }
`;

const LIKE_POST_NOTIFICATION = gql`
  ${NOTIFICATIONS_FIELDS}
  subscription Like_Post_Notification($recipientId: ID!) {
    likePost(recipientId: $recipientId) {
      ...NotificationsFields
    }
  }
`;

const LIKE_COMMENT_NOTIFICATION = gql`
  ${NOTIFICATIONS_FIELDS}
  subscription Like_Comment_Notification($recipientId: ID!) {
    likeComment(recipientId: $recipientId) {
      ...NotificationsFields
    }
  }
`;

const REPOST_POST_EVENT_NOTIFICATION = gql`
  ${NOTIFICATIONS_FIELDS}
  subscription Repost_Event_Notification($recipientId: ID!) {
    repostPostEvent(recipientId: $recipientId) {
      ...NotificationsFields
    }
  }
`;

const REPOST_COMMENT_EVENT_NOTIFICATION = gql`
  ${NOTIFICATIONS_FIELDS}
  subscription Repost_Event_Notification($recipientId: ID!) {
    repostCommentEvent(recipientId: $recipientId) {
      ...NotificationsFields
    }
  }
`;
export const Notifications = () => {
  const user = useAuthStore((state) => state.user);
   const addNotification = useNotificationStore((state) => state.addNotification);
   const addFollowerSubscription = useFollowerStore((state) => state.addFollowerSubscription);

  useSubscription<NotificationProps>(NEW_FOLLOWER_SUB, {
    variables: { recipientId: user?.id },
    skip: !user,
    onData: ({ data }) => {
      const notification = data?.data?.newFollower;
      if (notification) {
        addFollowerSubscription(notification);
      }
    },
  })

  useSubscription<LikePostProps>(LIKE_POST_NOTIFICATION, {
    variables: { recipientId: String(user?.id) },
    skip: !user,
    onData: ({ data }) => {
      const likePost = data?.data?.likePost;
      if (likePost?.actor_id.id === user?.id) return;
      if (likePost) {
        addNotification(likePost);
      }
    }
  })

  useSubscription<LikeCommentProps>(LIKE_COMMENT_NOTIFICATION, {
    variables: { recipientId: user?.id },
    skip: !user,
    onData: ({ data }) => {
      const likeComment = data?.data?.likeComment;
      if(likeComment?.actor_id.id === user?.id) return;
      if(likeComment) {
        addNotification(likeComment);
      }
    }
  })

  useSubscription<RepostPostEventProps>(REPOST_POST_EVENT_NOTIFICATION, {
    variables: { recipientId: user?.id },
    skip: !user,
    onData: ({ data }) => {
      const repostPostEvent = data?.data?.repostPostEvent;
      if(repostPostEvent?.actor_id.id === user?.id) return;
      if(repostPostEvent) {
        addNotification(repostPostEvent);
      }
    }
  })

  useSubscription<RepostCommentEventProps>(REPOST_COMMENT_EVENT_NOTIFICATION, {
    variables: { recipientId: user?.id },
    skip: !user,
    onData: ({ data }) => {
      const repostCommentEvent = data?.data?.repostCommentEvent;
      if(repostCommentEvent?.actor_id.id === user?.id) return;
      if(repostCommentEvent) {
        addNotification(repostCommentEvent);
      }
    }
  })


  return null;
}