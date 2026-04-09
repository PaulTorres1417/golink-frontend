import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
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
  }
`;

