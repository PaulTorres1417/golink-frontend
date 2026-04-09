import { gql } from "@apollo/client";

export const CREATE_VIEW_COMMENT = gql`
  mutation create_view_comment($commentId: ID!) {
    createViewComment(commentId: $commentId) {
      id
      view_count
      has_viewed
    }
  }
`