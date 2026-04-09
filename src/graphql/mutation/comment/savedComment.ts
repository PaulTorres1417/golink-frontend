import { gql } from "@apollo/client";

export const SAVED_COMMENT = gql`
  mutation Saved_Comment($commentId: ID!) {
    savedComment(commentId: $commentId) {
      id
      isSaved
    }
  }
`;