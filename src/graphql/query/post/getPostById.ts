import { gql } from "@apollo/client";

export const GET_POST_BY_ID = gql`
  query get_post_by_id($id: ID!) {
    getPostById(id: $id) {
      id
      content
      user_id {
        id
        avatar
        name
        email
      }
      media {
        id
        url
        media_type
      }
      created_at
      initialReaction
      countReaction
      comments
      view_count
      has_viewed
      isSaved
      count_repost
      isRepost
    }
  }
`;