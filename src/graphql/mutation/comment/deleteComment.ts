import { gql } from '@apollo/client';

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      id
      post_id
      parentCommentId
    }
  }
`;
