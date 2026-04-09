import { gql } from "@apollo/client";

export const REMOVE_POST = gql`
  mutation($postId: ID!) {
    removePostById(postId: $postId)
  }
`;