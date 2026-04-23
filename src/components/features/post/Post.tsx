import styled from 'styled-components';
import { PostContent } from './PostContent';
import { useEffect } from 'react';
import { EmptyPosts, Spinner, Avatar } from '@/components/ui';
import { usePostFeed } from '@/hooks/post/usePostFeed';

export const Post = () => {
const { posts, isInitialLoading, error, observerRef, 
  theme, isFetchingMore, handleObserver } = usePostFeed();

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null, rootMargin: '20px', threshold: 1.0,
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  if (isInitialLoading) <SpinnerWrapper><Spinner /></SpinnerWrapper>
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
      ? '#6f778b32'
      : '#a8b3cf62'};
  cursor: pointer;
`;
const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-Top: 20px;
`;
const SpinnerWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
`;