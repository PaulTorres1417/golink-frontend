import styled from 'styled-components';
import { PostContent } from './PostContent';
import { useQuery, useSubscription } from '@apollo/client/react';
import type { FeedPostsData, PostViewedSubscription, ReactionPostSubscription } from './types';
import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore, usePostStore, useTheme } from '@/store';
import { EmptyPosts, Spinner, Avatar } from '@/components/ui';
import type { PostCommentCountSubscription } from '@/pages/post/types';
import { FEED_POSTS } from '@/graphql/query';
import { REACTION_POST_SUBSCRIPTION, VIEWED_POST_SUBSCRIPTION, 
  POST_COMMENT_COUNT_SUBSCRIPTION } from '@/graphql/subcription';

export const Post = () => {
  const { data, loading, error, fetchMore, networkStatus } = 
  useQuery<FeedPostsData>(FEED_POSTS, {
    variables: { first: 5 },
    notifyOnNetworkStatusChange: true,
  });

  const posts = usePostStore((state) => state.posts);
  const appendPosts = usePostStore((state) => state.appendPosts);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const postRef = useRef(posts);
  const user = useAuthStore((state) => state.user)
  const { theme } = useTheme();
  const updatePostFields = usePostStore((state) => state.updatePostFields);
  const isInitialLoading = loading && networkStatus === 1;
  const isFetchingMore = networkStatus === 3;

  useEffect(() => {
    postRef.current = posts;
  }, [posts])

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        data?.feedPosts.pageInfo.hasNextPage
      ) {
        fetchMore({
          variables: {
            first: 5,
            after: data.feedPosts.pageInfo.endCursor,
          },
          updateQuery: (prevResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prevResult;

            return {
              feedPosts: {
                __typename: prevResult.feedPosts.__typename,
                edges: [
                  ...prevResult.feedPosts.edges,
                  ...fetchMoreResult.feedPosts.edges,
                ],
                pageInfo: fetchMoreResult.feedPosts.pageInfo,
              },
            };
          },
        });
      }
    },
    [data, fetchMore]
  );

  useSubscription<PostViewedSubscription>(VIEWED_POST_SUBSCRIPTION, {
    onData: ({ data: viewData }) => {
      const viewRes = viewData.data?.postViewed;
      if (!viewRes) return;
      console.log('viewRes.id:', viewRes.id);
      console.log('user?.id:', user?.id, 'viewRes.user_id.id:', viewRes.user_id.id);
      if (viewRes.user_id.id === user?.id) return;
      console.log('updatePostFields con id:', viewRes.id);
      updatePostFields(viewRes.id, {
        view_count: viewRes.view_count
      })
    }
  })

  useSubscription<ReactionPostSubscription>(REACTION_POST_SUBSCRIPTION, {
    onData: ({ data: reactionData }) => {
    const reactionRes = reactionData.data?.reactionPost;
    if (!reactionRes) return;
    if (reactionRes.user_id.id === user?.id) return;
    const currentPost = postRef.current.find(p => (p.clientId ?? p.id) === reactionRes.post_id.id);
    if (!currentPost) return;
      const newCount = reactionRes.action === 'CREATE'
        ? currentPost.countReaction + 1
        : Math.max(0, currentPost.countReaction - 1);

      updatePostFields(currentPost.id, {
        countReaction: newCount
      });
    }
  });

  useSubscription<PostCommentCountSubscription>(POST_COMMENT_COUNT_SUBSCRIPTION, {
    onData: ({ data }) => {
      const postCountData = data.data?.postCommentsCount;
      if (!postCountData) return;
        updatePostFields(postCountData.id, {
          comments: postCountData.comments
        })
    }
  })

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    if (!data?.feedPosts?.edges) return;
    const newPosts = data.feedPosts.edges.map((edge) => edge.node);
    const existingIds = new Set(posts.map((post) => post.id));
    const filteredPosts = newPosts.filter(
      (post) => !existingIds.has(post.id)
    );
    if (filteredPosts.length > 0) {
      appendPosts(filteredPosts);
    }
  }, [data, appendPosts, posts]);

  if (isInitialLoading) {
    return <ContainerSpinner>
      <Spinner />
    </ContainerSpinner>
  }
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container>
      {posts?.length ? (
        posts.map((post) => (
          <PostWrapper key={post.id} $theme={theme}>
            <Avatar avatarUrl={post.user_id.avatar} />
            <PostContent data={post} />
          </PostWrapper>
        ))
      ) : (
        <EmptyPosts />
      )}
      <div ref={observerRef} style={{ height: '1px' }} />
      {isFetchingMore
        && <Loading><Spinner /></Loading>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
`;

const PostWrapper = styled.article<{ $theme: string }>`
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 7px 12px 4px 12px;
  border-bottom: 1px solid ${({ $theme }) =>
    $theme === 'dark'
      ? 'rgba(132, 130, 130, 0.37)'
      : 'rgba(197, 197, 197, 0.41)'};
  cursor: pointer;
`;
const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-Top: 20px;
`;
const ContainerSpinner = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
`;