import { gql } from "@apollo/client";

export const SAVED_COMMENT_QUERY = gql`
    query Saved_Comment_Query {
        getSavedComment {
          id
          content
          user_id {
            id
            name
            avatar
            email
          }
          post_id {
            id
            content
          }
          created_at
          reactions
          initialReaction
          comments
          view_count
          has_viewed
          isSaved
        }
    }
`;