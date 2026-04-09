import styled from "styled-components";
import { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { useMutation } from "@apollo/client/react";
import type { CommentType, PostQueryProps } from "../post/types";
import { useTheme, usePostStore, useAuthStore } from '@/store';
import { REPLIES_BY_COMMENT, COMMENTS_BY_POST } from '@/graphql/query';
import { Avatar } from '@/components/ui';
import type { Comment, CreateCommentResponse, CreateCommentVar } from "./types";
import { CREATE_COMMENT_INPUT } from "@/graphql/mutation";

type CommentInputProps = {
  post?: PostQueryProps | CommentType;
  postId: string;
  parentCommentId?: string | null;
}

type CommentsByPostData = {
  commentsByPost: Comment;
}
type CommentsByReplyData = {
  repliesByComment: Comment;
}

export const CommentInput = ({ post, postId, parentCommentId }: CommentInputProps) => {
  const [comment, setComment] = useState<string>('');
  const user = useAuthStore((state) => state.user);
  const { theme } = useTheme();
  const updatePostCommentCount = usePostStore((state) => state.updatePostCommentCount);

  if (!post) return null;

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
      console.error('GraphQL errors:', err.graphQLErrors);   // Errores del servidor
  console.error('Network error:', err.networkError);     // Error de red
  console.error('Message:', err.message);
      setComment(currentComment);
    }
  };

  return (
    <Container $theme={theme}>
      <Avatar avatarUrl={user?.avatar} />
      <InputRow>
        <FakeInput
          id="post-text"
          name="post-text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`Post your reply${!post || user?.name === post.user_id.name
            ? ""
            : ` to @${(() => {
              const parts = post.user_id.name.split(" ");
              const firstName = parts[0];
              const lastName = parts[1] ?? "";
              const full = lastName ? `${firstName} ${lastName}` : firstName;
              return full.length > 17 ? full.slice(0, 17) + "..." : full;
            })()}`
            }`}
          $themeMode={theme}
          rows={1}
        />
        <ReplyButton
          onClick={handleSend}
          $thmeMode={theme}
          disabled={!comment.trim()}
        >
          Reply
        </ReplyButton>
      </InputRow>
    </Container>
  );
};

const Container = styled.div<{ $theme: string }>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid ${({ $theme }) =>
    $theme === 'dark'
      ? 'rgba(132, 130, 130, 0.37)'
      : 'rgba(197, 197, 197, 0.41)'};
  padding: 14px 12px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: flex-end;
  flex: 1;
  gap: 8px;
  max-width: 100%;
`;

const FakeInput = styled(TextareaAutosize) <{ $themeMode: string }>`
  flex: 1;
  font-family: inherit;
  background: transparent;
  padding: 8px 10px;
  font-size: 16px;
  border: none;
  outline: none;
  resize: none;
  color: ${({ $themeMode }) => ($themeMode === 'dark' ? '#fff' : '#000')};
  &::placeholder {
    color: #909296ff;
    font-size: 16px;
  }
`;

const ReplyButton = styled.button<{ $thmeMode: string }>`
  background-color: #1870f4;
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 999px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: #1a8cd8;
  }

  &:disabled {
    background-color: ${({ $thmeMode }) => ($thmeMode === 'dark' ? '#6e6d6dff' : '#ccc')};
    color: #000;
    cursor: not-allowed;
  }
`;