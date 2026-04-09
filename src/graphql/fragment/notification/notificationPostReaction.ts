import { gql } from "@apollo/client";

export const NOTIFICATIONS_FIELDS = gql`
  fragment NotificationsFields on Notification {
      id
      actor_id {
        id
        name
        email
        avatar
      }
      type
      reference_id
      reference_type
      read
      created_at
    }
`;