import { gql } from "@apollo/client";

export const CREATE_REPLY = gql`
  mutation CreateReply($postId: ID!, $parentCommentId: ID!, $content: String!) {
    createReply(postId: $postId, parentCommentId: $parentCommentId, content: $content) {
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