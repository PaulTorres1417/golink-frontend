import { gql } from "@apollo/client";

export const GET_TRENDING_POSTS = gql`
  query GetTrendingPosts($limit: Int) {
    getTrendingPosts(limit: $limit) {
      id
      content
      created_at
      countReaction
      count_repost
      reaction_avatars
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
  }
`;