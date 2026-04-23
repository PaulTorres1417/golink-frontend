import { useMutation, useSubscription } from '@apollo/client/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateViewProps, CreateViewVars, PostRepostCount } from './types';
import { useTheme, usePostStore } from '@/store';
import type {
  CommentAddedSubscription, CommentTypeProps,
  PostCommentCountSubscription
} from '@/pages/post/types';
import {
  POST_COMMENT_COUNT_SUBSCRIPTION, POST_REPOST_COUNT_SUBSCRIPTION,
  COMMENT_ADDED_SUBSCRIPTION
} from '@/graphql/subcription';
import { COMMENTS_BY_POST } from '@/graphql/query';
import { CREATE_VIEW_POST } from '@/graphql/mutation';
import type { PostQueryProps } from '@/components/features/post/types';

type PostContentProps = {
  data: PostQueryProps;
}

export const usePostContent = ({ data }: PostContentProps) => {
  const [isOpenOption, setIsOpenOption] = useState<boolean>(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const postId = data.clientId ?? data.id;
  const updatePostFields = usePostStore((state) => state.updatePostFields);
  const [create_view_post] = useMutation<CreateViewProps, CreateViewVars>(CREATE_VIEW_POST, {
    onCompleted: (viewData) => {
      updatePostFields(viewData.createViewPost.id, {
        has_viewed: viewData.createViewPost.has_viewed,
        view_count: viewData.createViewPost.view_count,
      });
    },
    onError: (error) => {
      console.error("Error creating view post:", error);
      updatePostFields(data.id, {
        has_viewed: false,
        view_count: data.view_count,
      });
    },
  });

  useSubscription<CommentAddedSubscription>(COMMENT_ADDED_SUBSCRIPTION, {
    onData: ({ client, data: subscriptionData }) => {
      const newComment = subscriptionData.data?.commentAdded;
      if (!newComment) return;

      if (newComment.post_id.id === postId && !newComment.parent_id) {
        client.cache.updateQuery<CommentTypeProps, { postId: string | undefined; first: number }>(
          {
            query: COMMENTS_BY_POST,
            variables: { postId: postId, first: 4 }
          },
          (existingData) => {
            if (!existingData) return existingData;

            const commentExists = existingData.commentsByPost.edges.some(
              edge => edge.node.id === newComment.id
            );

            if (commentExists) return existingData;

            return {
              commentsByPost: {
                ...existingData.commentsByPost,
                edges: [
                  {
                    __typename: 'CommentEdge' as const,
                    node: {
                      __typename: 'Comment' as const,
                      id: newComment.id,
                      content: newComment.content,
                      user_id: {
                        __typename: 'User',
                        id: newComment.user_id.id,
                        name: newComment.user_id.name,
                        email: newComment.user_id.email,
                        avatar: newComment.user_id.avatar ?? null
                      },
                      post_id: {
                        __typename: 'Post',
                        id: newComment.post_id.id,
                        content: newComment.post_id.content
                      },
                      created_at: newComment.created_at,
                      comments: newComment.comments ?? 0,
                      reactions: newComment.reactions ?? 0,
                      initialReaction: newComment.initialReaction ?? null,
                      view_count: newComment.view_count ?? 0,
                      has_viewed: newComment.has_viewed ?? false,
                      isSaved: newComment.isSaved ?? false,
                      count_repost: newComment.count_repost ?? 0,
                      isRepost: newComment.isRepost ?? false
                    },
                    cursor: new Date(newComment.created_at).getTime().toString()
                  },
                  ...existingData.commentsByPost.edges
                ]
              }
            };
          }
        );
      }
    }
  });

  useSubscription<PostCommentCountSubscription>(POST_COMMENT_COUNT_SUBSCRIPTION, {
    onData: ({ data }) => {
      const postCountData = data.data?.postCommentsCount;
      if (!postCountData) return;
      if (postCountData.id === postId) {
        updatePostFields(postCountData.id, {
          comments: postCountData.comments
        });
      }
    },
  })

  useSubscription<PostRepostCount>(POST_REPOST_COUNT_SUBSCRIPTION, {
    onData: ({ data }) => {
      const postRepostData = data.data?.postRepost;
      if (!postRepostData) return;
      if (postRepostData.id === postId) {
        updatePostFields(postRepostData.id, {
          count_repost: postRepostData.count_repost
        })
      }
    }
  })

  const handlePostDetails = (postData: PostQueryProps) => {
    if (!postData.has_viewed) {
      updatePostFields(postData.id, {
        has_viewed: true,
        view_count: postData.view_count + 1,
      });
      const realPostId = postData.clientId ?? postData.id;
      create_view_post({ variables: { postId: realPostId } });
    }
    navigate(`/post/${postData.clientId ? postData.clientId : postData.id}`,
      { state: { postData: { kind: 'Post' as const, ...postData } } });
    window.scrollTo({ top: 0 });
  }

  return { isOpenOption, setIsOpenOption, theme, handlePostDetails };
}