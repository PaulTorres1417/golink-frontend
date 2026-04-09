import { gql } from "@apollo/client";

export const CREATE_COMMENT_INPUT = gql`
  mutation Create_Comment($postId: ID!, $content: String!, $parentCommentId: ID){
    createComment(postId: $postId, content: $content, parentCommentId: $parentCommentId) {
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
      comments
      initialReaction
      reactions
      view_count
      has_viewed
      created_at
      isSaved
      count_repost
      isRepost
    }
  }
`;