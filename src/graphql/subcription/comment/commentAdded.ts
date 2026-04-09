import { gql } from "@apollo/client";

export const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded {
    commentAdded {
      id
      content
      created_at
      post_id {
        id
        content
      }
      parent_id
      user_id {
        id
        name
        email
        avatar
      }
      comments
      reactions
      initialReaction
      view_count
      has_viewed
      isSaved
    }
  }
`;