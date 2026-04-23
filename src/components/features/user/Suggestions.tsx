import styled from 'styled-components';
import { useQuery } from '@apollo/client/react';
import { Spinner } from '@/components/ui';
import { useTheme } from '@/store/theme';
import { ListUserNotFollowing } from './ListUserNotFollowing';
import type { User, UserListProps } from './types';
import { GET_ALL_USERS } from '@/graphql/query/user/getAllUsers';

export const Suggestions = () => {
  const { data, error, loading } = useQuery<UserListProps>(GET_ALL_USERS);
  const { theme } = useTheme();

  if (error) throw new Error('Error fetching users');

  return (
    <Container $theme={theme}>
      <Header>
        <h2>Who to follow</h2>
      </Header>
      <Content>
        {loading ? (
          <ContainerLoading>
            <Spinner />
          </ContainerLoading>
        ) : (
          data?.getAllUsers?.map((element: User) => (
            <ListUserNotFollowing key={element.id} data={element} />
          )))
        }
      </Content>
      <ShowMoreButton
        $theme={theme}>
        Show more
      </ShowMoreButton>
    </Container>
  )
}

const Container = styled.div<{ $theme: string }>`
  width: 100%;
  height: 300px;
  padding: 20px;
  border-radius: 17px;
  border: 1px solid ${({ $theme }) =>
    $theme === 'dark'
      ? 'rgba(132, 130, 130, 0.37)'
      : 'rgba(197, 197, 197, 0.41)'};
`;
const Content = styled.ul`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-direction: column;
  list-style: none;
`;

const Header = styled.div`
  width: 100%;
  padding-bottom: 7px;
  h2 {
    font-size: 20px;
    font-weight: bold;
  }
`;
export const ContainerLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ShowMoreButton = styled.button<{ $theme: string }>`
  background: transparent;
  display: flex;
  cursor: not-allowed;
  justify-content: flex-start;
  border: none;
  color: ${({ $theme }) => $theme === 'dark' ? '#3979daff' : '#1461d4'};
  font-size: 17px;
  padding-top: 5px;

  &:hover {
    color: #5391eeff
  }
`;
