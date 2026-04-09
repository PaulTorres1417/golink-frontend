import { gql } from "@apollo/client";

export const SAVED_POST = gql`
  mutation Saved_Post($postId: ID!) {
    savedPost(postId: $postId) {
      id
      isSaved
    }
  }
`;