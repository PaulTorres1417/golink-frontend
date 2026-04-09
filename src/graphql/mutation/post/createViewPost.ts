import { gql } from "@apollo/client";

export const CREATE_VIEW_POST = gql`
  mutation create_view_post($postId: ID!) {
    createViewPost(postId: $postId) {
      id
      view_count
      has_viewed
    }
  }
`;