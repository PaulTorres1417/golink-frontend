import { gql } from "@apollo/client";

export const SAVED_POST_QUERY = gql`
    query Saved_Post_Query {
        getSavedPosts {
          id
          content
          media {
            id
            url
            media_type
          }
          user_id {
            id
            name
            avatar
            email
          }
          original_post {
            id
            content
            user_id {
              id
              name
              email
              avatar
            }
            media {
              id
              url
              media_type
            }
          }
          original_comment {
            id
            content
            user_id {
              id
              name
              email
              avatar
            }
            post_id {
              id
              content
            }
          }
          created_at
          countReaction
          initialReaction
          comments
          view_count
          has_viewed
          isSaved
        }
    }
`;