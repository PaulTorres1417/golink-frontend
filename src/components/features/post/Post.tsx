import styled from 'styled-components';
import { PostContent } from './PostContent';
import { useEffect, useRef } from 'react';
import { EmptyPosts, Spinner, Avatar } from '@/components/ui';
import { usePostFeed } from '@/hooks/post/usePostFeed';
import { useTheme } from '@/store';

export const Post = () => {
  const { posts, isInitialLoading, error, isFetchingMore, handleObserver } = usePostFeed();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme(); 

  useEffect(() => {
    const currentRef = observerRef.current; 
    const observer = new IntersectionObserver(handleObserver, {
      root: null, rootMargin: '200px', threshold: 0.1,
    });
    if (currentRef) observer.observe(currentRef);
  
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [handleObserver]);

  if (isInitialLoading) return <SpinnerWrapper><Spinner /></SpinnerWrapper>
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
      <Loading>
        {isFetchingMore && <Spinner />}
      </Loading>
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
      ? '#6f778b52'
      : '#a8b3cf62'};
  cursor: pointer;
`;
const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;
const SpinnerWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
`;