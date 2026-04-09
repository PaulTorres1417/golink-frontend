import { gql } from "@apollo/client";

export const GET_FOLLOWER = gql`
  query Get_Follower($first: Int!, $after: String) {
    getFollowers(first: $first, after: $after) {
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