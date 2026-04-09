import { gql } from '@apollo/client'

export const COMMENTS_BY_POST = gql`
  query Comments_By_Post($postId: ID!, $first: Int!, $after: String){
    commentsByPost(postId: $postId, first: $first, after: $after) {
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
          post_id {
            id
            content
          }
          created_at
          comments
          initialReaction
          reactions
          view_count
          has_viewed
          isSaved
          count_repost
          isRepost
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;