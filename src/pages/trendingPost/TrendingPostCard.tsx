import styled from 'styled-components';
import { useQuery } from '@apollo/client/react';
import { useTheme } from '@/store/theme';
import { Spinner } from '@components/ui';
import { Card } from './Card';
import type { TrendingQuery } from './types';
import { GET_TRENDING_POSTS } from '@/graphql/query';

export const TrendingPostCard = () => {
  const { theme } = useTheme();
  const { data, loading, error } = useQuery<TrendingQuery>(GET_TRENDING_POSTS, {
    variables: { limit: 4 }
  });

  if (error) throw new Error('Error al traer la lista de treding posts');

  return (
    <>
    <Container $theme={theme}>
      <ContainerUser>
        <h1>Trending posts</h1>
      </ContainerUser>
      <ContentArea>
        {loading ? (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        ) : (
          data?.getTrendingPosts.length !== 0 ?
            data?.getTrendingPosts?.map((post) => (
              <Card key={post.id} post={post}/>
            )) : <Empty>No hay posts trending</Empty>
        )
        }
      </ContentArea>
    </Container>
    <Footer>
        <span>© 2026 Paul Torres H. Designed & developed by me.</span>
    </Footer>
    </>
  );
};

const ContainerUser = styled.div`
  width: 100%;
   h1 {
    font-size: 20px;
    font-weight: bold;
    padding: 15px 15px 12px 15px;
  }
`;

const Container = styled.div<{ $theme: string }>`
  border: 1px solid ${({ $theme }) => 
    $theme === 'dark' 
      ? 'rgba(132, 130, 130, 0.37)' 
      : 'rgba(197, 197, 197, 0.41)'};
  border-radius: 20px;
`;

const ContentArea = styled.div`
  width: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Empty = styled.p`
  text-align: center;
  padding: 18px;
  font-size: 14px;
  color: rgba(113, 118, 123, 1);
`;
const Footer = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 14px;
    margin-top: 5px;
    color: rgba(128, 127, 127, 1);
  }
`;