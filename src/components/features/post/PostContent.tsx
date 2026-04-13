import styled from 'styled-components';
import { useMutation, useSubscription } from '@apollo/client/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlOptions } from "react-icons/sl";
import { ModalOption } from './modals/ModalOption';
import { PostActions } from './PostActions';
import type { CreateViewProps, CreateViewVars, PostQueryProps, PostRepostCount } from './types';
import { useTheme, usePostStore } from '@/store';
import { RepostCard } from './PostCardRepost';
import { PostFeedVideo } from './PostFeedVideo';
import type { CommentAddedSubscription, CommentTypeProps, 
  PostCommentCountSubscription } from '@/pages/post/types';
import { POST_COMMENT_COUNT_SUBSCRIPTION, POST_REPOST_COUNT_SUBSCRIPTION, 
  COMMENT_ADDED_SUBSCRIPTION } from '@/graphql/subcription';
import { COMMENTS_BY_POST } from '@/graphql/query';
import { CREATE_VIEW_POST } from '@/graphql/mutation';
import { dayjs } from '@/utils';

interface Props {
  data: PostQueryProps;
  isLCP?: boolean;
}

export const PostContent = ({ data, isLCP = false }: Props) => {
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

  return (
    <Container onClick={() => handlePostDetails(data)}>
      <div>
        <Title>
          <SubTitle $theme={theme}>
            <H2 $theme={theme}><strong>{(() => {
              const parts = data.user_id.name.split(" ");
              const firstName = parts[0];
              const lastName = parts[1] ?? "";
              const full = lastName ? `${firstName} ${lastName}` : firstName;
              return full.length > 17 ? full.slice(0, 17) + "..." : full;
            })()}</strong></H2>
            <span>@{data.user_id.email
              ? data.user_id.email.split("@")[0]
              : "anonmus"} &middot; {dayjs(data.created_at).fromNow(true)}</span>
          </SubTitle>
          <Option onClick={(e) => {
            e.stopPropagation();
            setIsOpenOption((prev) => !prev);
          }}>
            <span>
              <SlOptions size={17} style={{
                color: !isOpenOption
                  ? theme === 'dark'
                    ? 'rgba(113, 118, 123, 1)'
                    : 'rgba(83, 100, 113, 1)'
                  : '#1870f4'
              }} />
            </span>
            {isOpenOption &&
              <ModalOption
                setIsOpenOption={setIsOpenOption}
                post={data}
              />
            }
          </Option>
        </Title>
        <Content>{data.content}</Content>
      </div>
      <div>
        {data.media && (
          <ContainerMedia>
            {data.media.media_type === 'video' ? (
              <VideoWrapper>
              <PostFeedVideo 
               src={data.media.url} 
               theme={theme} 
               isLCP={isLCP}
              />
              </VideoWrapper>
            ) : (
              <img 
               src={data.media.url} 
               alt="Post media" 
               width={600}
               height={400}
              />
            )}
          </ContainerMedia>
        )}
      </div>

      {/* repost */}
      <RepostCard
        original_comment={data.original_comment}
        original_post={data.original_post}
      />
      {/* actions icons post */}
      <PostActions data={data} initialReaction={data.initialReaction} />
    </Container>
  )
}

const ContainerMedia = styled.div`
  width: 100%;
  margin: 12px 0px 7px 0px;
  border-radius: 16px;
  padding: 0px 5px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  aspect-ratio: 16/9;

  img {
    display: block;
    border-radius: 16px;
    min-width: 320px;
    max-width: 100%;
    max-height: 400px;
    height: auto;
    object-fit: cover; 
    background: transparent; 
  }

  @media (max-width: 768px) {
    img {
      max-height: 450px;
    }
  }

  @media (max-width: 480px) {
    img {
      max-height: 350px;
    }
  }
`;

const H2 = styled.h2<{ $theme: string }>`
  font-size: 15px;
  font-weight: 400;
  padding: 0px 5px;
  color: ${({ $theme }) => $theme === 'dark' ? '#fff' : '#000'}
`;

const Content = styled.p`
  width: 100%;
  padding: 0px 5px;
  font-family: Google Sans Text, Roboto, Arial, sans-serif;
  font-weight: 400;
  font-size: 15px;
  display: block;
  word-wrap: break-word;
  text-aling: inherit;
     
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;
  line-height: 20px;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
`;

const VideoWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16/9;  
  border-radius: 16px;
  overflow: hidden;
  background: ${({ theme }) => theme === 'dark' ? '#000' : '#f0f0f0'};

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Container = styled.div`
  flex: 1;
  min-width: 0;
  width: 100%;
`;

const Option = styled.div`
  margin: 4px 5px 0px 7px;
  cursor: pointer;
  position: relative;
  display: inline-block;
`;

const SubTitle = styled.div<{ $theme: string }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  span {
    font-size: 15px;
    margin-left: 4px;
    color: ${({ $theme }) =>
    ($theme === 'dark'
      ? 'rgba(113, 118, 123, 1)'
      : 'rgba(83, 100, 113, 1)')};
  }
`;

const Title = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
