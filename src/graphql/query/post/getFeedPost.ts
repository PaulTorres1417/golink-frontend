import { gql } from '@apollo/client'

export const FEED_POSTS = gql`
  query Feed_Posts($first: Int!, $after: String) {
    feedPosts(first: $first, after: $after) {
      edges {
        node {
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
          initialReaction
          countReaction
          comments
          view_count
          has_viewed
          isSaved
          count_repost
          isRepost
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;