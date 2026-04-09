import styled from "styled-components";
import { useParams, useLocation, useNavigate, type Location } from "react-router-dom";
import { useState } from "react";
import { useQuery, useSubscription } from "@apollo/client/react";
import { useTheme, useAuthStore, usePostStore } from "@/store";
import { COMMENTS_BY_POST, GET_POST_BY_ID } from "@/graphql/query";
import { COMMENT_ADDED_SUBSCRIPTION, REACTION_COMMENT_SUBSCRIPTION, COMMENTS_COUNT_SUBSCRIPTION, 
  POST_COMMENT_COUNT_SUBSCRIPTION, VIEW_COMMENT_SUBSCRIPTION } from "@/graphql/subcription";
  import { Spinner } from "@components/ui";
  import { PostThreadActions, Thread } from "@features/post/";
  import { Comment, CommentInput } from "@features/comment";
  import type { PostType } from "@features/post/types";
  import type * as types from "./types";
import { FiArrowLeft } from "react-icons/fi";

export const PostThread = () => {
  const [loadingMore, setLoadingMore] = useState(false);
  const currentUserId = useAuthStore(state => state.user?.id);
  const updatePostFields = usePostStore((state) => state.updatePostFields);
  const { id } = useParams();
  const location = useLocation() as Location<{ postData: PostType }>
  const navigate = useNavigate();
  const post = location.state?.postData;
  const { theme } = useTheme();
  const { data, loading, fetchMore } = useQuery<types.CommentTypeProps>(COMMENTS_BY_POST, {
    variables: { postId: id, first: 4 },
    notifyOnNetworkStatusChange: true,
  });
  const { data: dataPost, error } = useQuery<types.PostDataProps, types.PostDataVars>(GET_POST_BY_ID, {
    variables: { id: id! }
  });

  useSubscription<types.CommentAddedSubscription>(COMMENT_ADDED_SUBSCRIPTION, {
    onData: ({ client, data: subscriptionData }) => {
      const newComment = subscriptionData.data?.commentAdded;
      if (!newComment) return;

      if (newComment.post_id.id === id && !newComment.parent_id) {
        client.cache.updateQuery<types.CommentTypeProps, { postId: string | undefined; first: number }>(
          {
            query: COMMENTS_BY_POST,
            variables: { postId: id, first: 4 }
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

  useSubscription<types.PostCommentCountSubscription>(POST_COMMENT_COUNT_SUBSCRIPTION, {
    onData: ({ data }) => {
      const postCountData = data.data?.postCommentsCount;
      if (!postCountData) return;
      if (postCountData.id === id) {
        updatePostFields(postCountData.id, {
          comments: postCountData.comments
        })
      }
    }
  })

  useSubscription<types.ReactionCommentSubscription>(REACTION_COMMENT_SUBSCRIPTION, {
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
            return newCount;
          },
          initialReaction(existing) {
            return existing;
          }
        }
      });
    },
  });

  useSubscription<types.ViewCommentSubscription>(VIEW_COMMENT_SUBSCRIPTION, {
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

  useSubscription<types.CommentsCountSubscription>(COMMENTS_COUNT_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      const commentCountData = data.data?.commentsCount;
      if (!commentCountData) return;

      client.cache.modify({
        id: client.cache.identify({ __typename: 'Comment', id: commentCountData.id }),
        fields: {
          comments: () => {
            return commentCountData.comments;
          }
        }
      })
    }
  })

  if (error) throw new Error(`Error fetching post data: ${error.message}`);

  const postState = dataPost?.getPostById;

  const postForActions: PostType | undefined = postState ? {
    kind: 'Post' as const,
    id: postState.id,
    content: postState.content,
    user_id: postState.user_id,
    media: postState.media,
    created_at: postState.created_at,
    initialReaction: postState.initialReaction,
    countReaction: postState.countReaction,
    comments: postState.comments,
    view_count: postState.view_count ?? 0,
    has_viewed: postState.has_viewed ?? false,
    clientId: postState.id,
    isSaved: postState.isSaved ?? false,
    original_comment: null,
    original_post: null,
    count_repost: postState.count_repost ?? 0,
    isRepost: postState.isRepost ?? false
  } : undefined;

  const loadMoreComments = async () => {
    if (!data?.commentsByPost.pageInfo.hasNextPage) return;
    setLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          postId: id,
          first: 4,
          after: data.commentsByPost.pageInfo.endCursor,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          return {
            commentsByPost: {
              __typename: prevResult.commentsByPost.__typename,
              edges: [
                ...prevResult.commentsByPost.edges,
                ...fetchMoreResult.commentsByPost.edges,
              ],
              pageInfo: fetchMoreResult.commentsByPost.pageInfo,
            },
          };
        },
      });
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <Container>
      <HeaderTop>
        <BackButton
          onClick={() => navigate(-1)}
          $themeMode={theme}
        >
          <FiArrowLeft size={22} style={{ cursor: 'pointer' }}/>
        </BackButton>
        <Title>Post</Title>
      </HeaderTop>
      {/* Thread */}
      <Thread post={post} />
      <PostThreadActions post={postForActions ?? post} statePost={true} />
      <CommentInput post={post} postId={id!} />

      <ContainerComment>
        {loading && !data ? (
          <LoadingSpinner>
            <Spinner />
          </LoadingSpinner>
        ) : data?.commentsByPost.edges?.length ? (
          <>
            {data.commentsByPost.edges.map(({ node }) => (
              <Comment key={node.id} comment={node} post={post} />
            ))}
            {loadingMore && (
              <LoadingMoreWrapper>
                <Spinner />
              </LoadingMoreWrapper>
            )}
          </>
        ) : (
          <P>No comments yet</P>
        )}
        {data?.commentsByPost.pageInfo.hasNextPage && (
          <LoadingButton onClick={loadMoreComments}>
            {loading ? ' Cargando...' : ' Mas comentarios'}
          </LoadingButton>
        )}
      </ContainerComment>
    </Container>
  );
};


const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 600px;
`;
const ContainerComment = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const LoadingMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  width: 100%;
`;
const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  top: 0;
  z-index: 15;
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
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  width: 100%;
`;

const BackButton = styled.button<{ $themeMode: string }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: none;
  background: transparent;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 13px;
  cursor: pointer;

  svg {
    font-size: 22px;
    color: ${({ $themeMode }) => $themeMode === 'dark' ? '#e4e6eb' : '#000'};
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const P = styled.p`
  padding: 20px;
  text-align: center;
  color: gray;
`;
