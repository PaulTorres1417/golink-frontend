import styled from "styled-components";
import { useParams, useLocation, useNavigate, type Location } from "react-router-dom";
import { useState } from "react";
import { useQuery, useSubscription } from "@apollo/client/react";
import { useTheme, useAuthStore } from "@/store";
import { PostContent, Thread, PostThreadActions, PostDetailAction } from "@features/post";
import { Comment, CommentInput } from "@features/comment";
import { REPLIES_BY_COMMENT } from "@/graphql/query";
import { REACTION_COMMENT_SUBSCRIPTION, COMMENT_ADDED_SUBSCRIPTION, 
  VIEW_COMMENT_SUBSCRIPTION, COMMENTS_COUNT_SUBSCRIPTION } from "@/graphql/subcription";
import { Avatar, Spinner } from "@components/ui";
import type { CommentType, PostType } from "@features/post/types";
import type { CommentAddedSubscription, CommentsCountSubscription, ReactionCommentSubscription, 
  ReplyCommentProps, ReplyCommentVars, ViewCommentSubscription } from "./types";
import { dayjs } from '@/utils';
import { FaUserCircle } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

export const CommentThread = () => {
  const { id, commentId } = useParams();
  const currentUserId = useAuthStore(state => state.user?.id);
  const navigate = useNavigate();
  const { state } = useLocation() as Location<{
    commentData: CommentType,
    postData: PostType,
    ancestorComments: CommentType[]
  }>
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const { data, loading: loadingReplies, fetchMore } = useQuery<ReplyCommentProps, ReplyCommentVars>(REPLIES_BY_COMMENT, {
    variables: { commentId, first: 4 },
  });

  useSubscription<ReactionCommentSubscription>(REACTION_COMMENT_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      const reaction = data.data?.reactionComment;
      if (!reaction) return;

      const isCurrentUser = reaction.user_id.id === currentUserId;
      if (isCurrentUser) return;

      const isCreate = reaction.action === 'CREATE';

      client.cache.modify({
        id: client.cache.identify({
          __typename: 'Comment',
          id: reaction.comment_id.id
        }),
        fields: {
          reactions(existingCount: number = 0) {
            const newCount = isCreate ? existingCount + 1 : Math.max(0, existingCount - 1);
            console.log('Updating reactions:', existingCount, '→', newCount);
            return newCount;
          },
          initialReaction(existing) {
            return existing;
          }
        }
      });
    },
    onError: (error) => {
      console.error('Reaction subscription error:', error);
    }
  });

  useSubscription<ViewCommentSubscription>(VIEW_COMMENT_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      const viewed = data.data?.commentViewed;

      if (!viewed) return;

      if (viewed.user_id.id === currentUserId) {
        return;
      }
      client.cache.modify({
        id: client.cache.identify({ __typename: 'Comment', id: viewed.id }),
        fields: {
          view_count: () => {
            return viewed.view_count;
          },
        }
      });
    }
  });

  useSubscription<CommentsCountSubscription>(COMMENTS_COUNT_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      const commentCountData = data.data?.commentsCount;
      if (!commentCountData) return;

      client.cache.modify({
        id: client.cache.identify({ __typename: 'Comment', id: commentCountData.id }),
        fields: {
          comments: () => commentCountData.comments
        }
      });
    }
  });

  useSubscription<CommentAddedSubscription>(COMMENT_ADDED_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      const newComment = data.data?.commentAdded;
      if (!newComment) return;

      if (newComment.parent_id !== commentId) return;

      client.cache.updateQuery<ReplyCommentProps, ReplyCommentVars>(
        {
          query: REPLIES_BY_COMMENT,
          variables: { commentId, first: 4 }
        },
        (existingData) => {
          if (!existingData) return existingData;

          const commentExists = existingData.repliesByComment.edges.some(
            edge => edge.node.id === newComment.id
          );

          if (commentExists) return existingData;

          return {
            repliesByComment: {
              ...existingData.repliesByComment,
              edges: [
                {
                  __typename: 'CommentEdge' as const,
                  node: {
                    __typename: 'Comment' as const,
                    id: newComment.id,
                    content: newComment.content,
                    user_id: {
                      __typename: 'User' as const,
                      id: newComment.user_id.id,
                      name: newComment.user_id.name,
                      email: newComment.user_id.email,
                      avatar: newComment.user_id.avatar,
                    },
                    post_id: {
                      __typename: 'Post' as const,
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
                ...existingData.repliesByComment.edges
              ]
            }
          };
        }
      );
    }
  });

  const handleLoadMore = async () => {
    if (!data?.repliesByComment.pageInfo.hasNextPage) return;
    setLoading(true);

    try {
      await fetchMore({
        variables: {
          commentId,
          first: 4,
          after: data.repliesByComment.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const existingIds = new Set(prev.repliesByComment.edges.map(e => e.node.id));
          const newEdges = fetchMoreResult.repliesByComment.edges.filter(e => !existingIds.has(e.node.id));

          return {
            repliesByComment: {
              __typename: prev.repliesByComment.__typename,
              edges: [...newEdges, ...prev.repliesByComment.edges],
              pageInfo: fetchMoreResult.repliesByComment.pageInfo,
            },
          };
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const comment = state?.commentData;
  const ancestorComments = state?.ancestorComments || [];

  // Componente para mostrar comentarios ancestros con diseño horizontal
  const AncestorComment = ({ comment }: any) => {
    return (
      <>
        <AncestorCommentContent>
          <AvatarContainer>
            {comment.user_id.avatar ? (
              <img src={comment.user_id.avatar} alt={`${comment.user_id.name}'s avatar`} />
            ) : (
              <FaUserCircle size={40} />
            )}
          </AvatarContainer>
          <TextContent>
            <UserInfo>
              <UserName>{comment.user_id.name}</UserName>
              <Email $themeMode={theme}>
                @{comment.user_id.email ? comment.user_id.email.split("@")[0] : "anonimus"}
              </Email>
              <Time $themeMode={theme}>
                &middot;<span>{dayjs(comment.created_at).fromNow(true)}</span>
              </Time>
            </UserInfo>
            <CommentText $themeMode={theme}>{comment.content}</CommentText>
            <PostDetailAction comment={comment} />
          </TextContent>
        </AncestorCommentContent>
      </>
    );
  };

  return (
    <Container onClick={() => console.log("container click")}>
      <HeaderTop>
        <BackButton onClick={() => navigate(-1)} $themeMode={theme}>
          <FiArrowLeft size={22} style={{ cursor: 'pointer' }} />
        </BackButton>
        <Title>Reply</Title>
      </HeaderTop>

      <ThreadConnectorWrapper>
        {/* Post raíz */}
        <PostWrapperWithLine>
          <PostWrapper>
            <Avatar avatarUrl={state.postData.user_id.avatar} />
            <PostContent data={state.postData} />
          </PostWrapper>
          {/* Línea vertical que conecta el post con el primer comentario */}
          {ancestorComments.length > 0 && <ThreadLine $isFromPost={true} $themeMode={theme} />}
        </PostWrapperWithLine>

        {/* Renderizar TODOS los comentarios ancestros EXCEPTO el último */}
        {ancestorComments.slice(0, -1).map((ancestorComment: any) => (
          <AncestorCommentWrapperWithLine key={ancestorComment.id}>
            <AncestorComment comment={ancestorComment} />
            {/* Línea vertical que conecta este comentario con el siguiente */}
            <ThreadLine $isFromPost={false} $themeMode={theme} />
          </AncestorCommentWrapperWithLine>
        ))}

        {/* Comentario actual (el más profundo, al que se está respondiendo) */}
        <Thread post={comment} />
      </ThreadConnectorWrapper>

      <PostThreadActions post={comment} statePost={false} />

      {/* Input para responder a este comentario */}
      <CommentInput
        post={comment}
        postId={id!}
        parentCommentId={comment.id}
      />

      {/* Respuestas al comentario actual */}
      <ContainerComment>
        {loadingReplies ? (
          <ContainerSpinner><Spinner /></ContainerSpinner>
        ) : data?.repliesByComment.edges?.length ? (
          data.repliesByComment.edges.map(({ node }) => (
            <Comment key={node.id} comment={node} post={state.postData} />
          ))
        ) : (
          <P>No replies yet</P>
        )}

        {data?.repliesByComment.pageInfo.hasNextPage && (
          <LoadingButton onClick={handleLoadMore}>
            {loading ? 'Cargando...' : 'Más comentarios'}
          </LoadingButton>
        )}
      </ContainerComment>
    </Container>
  );
};


const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 10px;
`;

const ThreadConnectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostWrapperWithLine = styled.div`
  position: relative;
`;

const PostWrapper = styled.div`
  display: flex;
  padding: 8px 12px;
  position: relative;
  gap: 7px;
`;

const AncestorCommentWrapperWithLine = styled.div`
  position: relative;
`;

const ThreadLine = styled.div<{ $isFromPost: boolean, $themeMode: string }>`
  position: absolute;
  left: 31px;
  top: ${({ $isFromPost }) => $isFromPost ? '58px' : '46px'};
  bottom: 6px;
  width: 2px;
  background-color: ${({ $themeMode }) =>
    $themeMode === 'dark'
      ? 'rgba(132, 130, 130, 0.49)'
      : 'rgba(134, 143, 148, 0.49)'};
  z-index: 0;
`;

const AncestorCommentContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 0px 12px 10px 12px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const AvatarContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 2;

  img, svg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0px 5px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
`;

const UserName = styled.span`
  font-weight: 600;
`;

const Email = styled.span<{ $themeMode: string }>`
  color: ${({ $themeMode }) =>
    $themeMode === 'dark'
      ? 'rgba(113, 118, 123, 1)'
      : 'rgba(53, 71, 99, 0.9)'};
`;

const Time = styled.span<{ $themeMode: string }>`
  color: ${({ $themeMode }) =>
    $themeMode === 'dark'
      ? 'rgba(113, 118, 123, 1)'
      : 'rgba(53, 71, 99, 0.6)'};
  
  span {
    margin-left: 3px;
  }
`;

const CommentText = styled.p<{ $themeMode: string }>`
  margin: 5px 0 0;
  font-size: 15px;
  line-height: 1.4;
  color: ${({ $themeMode }) => ($themeMode === 'dark' ? '#ffffffff' : '#555')};
`;

const BackButton = styled.button<{ $themeMode: string }>`
  border: none;
  background: transparent;
  cursor: pointer;
  svg {
    font-size: 22px;
    color: ${({ $themeMode }) => $themeMode === 'dark' ? '#e4e6eb' : '#000'};
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;

const ContainerComment = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;
const ContainerSpinner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
const P = styled.p`
  text-align: center;
  padding: 20px;
  color: gray;
`;

const LoadingButton = styled.button`
  background: transparent;
  border: none;
  color: #1d9bf0;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  padding: 14px 0;
  width: 100%;
  text-align: center;
  transition: color 0.2s ease, transform 0.1s ease;

  &:hover {
    color: #0d8ae8;
    transform: scale(1.03);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    color: gray;
    cursor: default;
    transform: none;
  }
`;