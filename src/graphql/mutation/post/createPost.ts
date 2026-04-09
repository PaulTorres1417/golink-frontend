import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation create_post($content: String!, $media: CreateMediaInput, $originalCommentId: String,
      $originalPostId: String) {
    createPost(content: $content, media: $media, originalCommentId: $originalCommentId,
    originalPostId: $originalPostId) {
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
          avatar
          email
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
        parent_id
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
        comments
        reactions
        initialReaction
        view_count
        has_viewed
        isSaved
      }
      created_at
      count_repost
      isRepost
    }
  }
`;