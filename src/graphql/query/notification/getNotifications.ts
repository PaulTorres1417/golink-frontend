import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query get_Notifications($first: Int!, $after: String) {
    getNotifications(first: $first, after: $after) {
      edges {
        node {
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
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;