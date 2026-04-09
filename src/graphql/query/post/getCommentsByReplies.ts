import { gql } from '@apollo/client'

export const REPLIES_BY_COMMENT = gql`
  query Replies_By_Comment($commentId: ID!, $first: Int!, $after: String){
    repliesByComment(commentId: $commentId, first: $first, after: $after) {
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