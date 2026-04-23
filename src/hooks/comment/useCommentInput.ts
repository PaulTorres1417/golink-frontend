import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useTheme, usePostStore, useAuthStore } from '@/store';
import { REPLIES_BY_COMMENT, COMMENTS_BY_POST } from '@/graphql/query';
import type { Comment, CreateCommentResponse, CreateCommentVar } from '@features/comment/types';
import { CREATE_COMMENT_INPUT } from "@/graphql/mutation";
import type { CommentType, PostQueryProps } from "@/components/features/post/types";

type CommentsByPostData = {
  commentsByPost: Comment;
}
type CommentsByReplyData = {
  repliesByComment: Comment;
}
type Props = {
  post?: PostQueryProps | CommentType;
  postId: string;
  parentCommentId?: string | null;
}
export const useCommentInput = ({ post, postId, parentCommentId }: Props) => {
  const [comment, setComment] = useState<string>('');
  const user = useAuthStore((state) => state.user);
  const { theme } = useTheme();
  const updatePostCommentCount = usePostStore((state) => state.updatePostCommentCount);

  const [Create_Comment] = useMutation<CreateCommentResponse, CreateCommentVar>(CREATE_COMMENT_INPUT, {
    update: (cache, result) => {
      const newComment =
        (result.data as CreateCommentResponse | undefined)?.createComment ||
        (result as any)?.optimisticResponse?.createComment;
      if (!newComment) return;
      const isOptimistic = newComment.id.startsWith('temp-');
      if (isOptimistic) {
        updatePostCommentCount(postId, 1);
      }

      if (parentCommentId) {
        cache.modify({
          id: cache.identify({ __typename: 'Comment', id: parentCommentId }),
          fields: {
            comments(existingCount = 0) {
              return existingCount + 1;
            }
          }
        });
      }

      const newEdge = {
        __typename: parentCommentId ? "ReplyEdge" : "CommentEdge",
        node: {
          __typename: "Comment",
          id: newComment.id,
          content: newComment.content,
          user_id: newComment.user_id,
          post_id: newComment.post_id ?? { __typename: 'Post', id: postId, content: '' },
          comments: newComment.comments,
          created_at: newComment.created_at,
          initialReaction: newComment.initialReaction ?? null,
          reactions: newComment.reactions ?? 0,
          view_count: newComment.view_count ?? 0,
          has_viewed: newComment.has_viewed ?? false,
          isSaved: newComment.isSaved ?? false,
          count_repost: newComment.count_repost ?? 0,
          isRepost: newComment.isRepost ?? false
        },
        cursor: newComment.id,
      };

      if (parentCommentId) {

        const existingData = cache.readQuery<CommentsByReplyData>({
          query: REPLIES_BY_COMMENT,
          variables: { commentId: parentCommentId, first: 4 },
        });

        if (existingData) {
          const exists = existingData.repliesByComment.edges.some(
            (edge) => edge.node.id === newComment.id
          );

          if (!exists) {
            cache.writeQuery<CommentsByReplyData>({
              query: REPLIES_BY_COMMENT,
              variables: { commentId: parentCommentId, first: 4 },
              data: {
                repliesByComment: {
                  __typename: existingData.repliesByComment.__typename,
                  edges: [newEdge, ...existingData.repliesByComment.edges],
                  pageInfo: existingData.repliesByComment.pageInfo,
                },
              },
            });
          }
        } else {
          cache.writeQuery<CommentsByReplyData>({
            query: REPLIES_BY_COMMENT,
            variables: { commentId: parentCommentId, first: 4 },
            data: {
              repliesByComment: {
                __typename: "ReplyConnection",
                edges: [newEdge],
                pageInfo: {
                  __typename: "PageInfo",
                  endCursor: newEdge.cursor,
                  hasNextPage: false,
                },
              },
            },
          });
        }

      } else {

        const existingData = cache.readQuery<CommentsByPostData>({
          query: COMMENTS_BY_POST,
          variables: { postId, first: 4 },
        });

        if (existingData) {
          const exists = existingData.commentsByPost.edges.some(
            (edge) => edge.node.id === newComment.id
          );

          if (!exists) {
            cache.writeQuery<CommentsByPostData>({
              query: COMMENTS_BY_POST,
              variables: { postId, first: 4 },
              data: {
                commentsByPost: {
                  __typename: existingData.commentsByPost.__typename,
                  edges: [newEdge, ...existingData.commentsByPost.edges],
                  pageInfo: existingData.commentsByPost.pageInfo,
                },
              },
            });
          }
        }
      }
    },

  })

  const handleSend = async () => {
    if (!comment.trim()) return;
    const currentComment = comment;
    setComment('');

    try {
      await Create_Comment({
        variables: {
          postId,
          content: currentComment,
          parentCommentId,
        },
        optimisticResponse: {
          createComment: {
            __typename: "Comment",
            id: 'temp-' + Date.now(),
            content: currentComment,
            user_id: {
              __typename: "User",
              id: user?.id || '',
              name: user?.name || '',
              email: user?.email || '',
              avatar: user?.avatar || null,
            },
            post_id: {
              id: post?.id ?? postId,
              content: '',
            },
            comments: 0,
            initialReaction: false,
            reactions: 0,
            has_viewed: false,
            view_count: 0,
            isSaved: false,
            count_repost: 0,
            isRepost: false,
            created_at: new Date().toISOString(),
          }
        }
      });
    } catch (error) {
      const err = error as any;
      console.error("Error creating comment:", error);
      console.error('GraphQL errors:', err.graphQLErrors);
      console.error('Network error:', err.networkError);
      console.error('Message:', err.message);
      setComment(currentComment);
    }
  };

  return { comment, setComment, theme, user, handleSend };
}