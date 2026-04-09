import { gql } from "@apollo/client";

export const REPLIES_BY_COMMENT_QUERY = gql`
  query RepliesByComment($commentId: ID!, $first: Int, $after: String) {
    repliesByComment(commentId: $commentId, first: $first, after: $after) {
      edges {
        node {
          id
          content
          created_at
          user_id {
            id
            name
            email
            avatar
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;