import { gql } from "@apollo/client";

export const COMMENTS_BY_POST_QUERY = gql`
  query CommentsByPost($postId: ID!, $first: Int!, $after: String) {
    commentsByPost(postId: $postId, first: $first, after: $after) {
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
