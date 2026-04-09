import styled from 'styled-components';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Spinner } from '../../ui/Spinner';
import { useTheme } from '../../../store/theme/ThemeContext';
import { ListUserNotFollowing } from '../../features/user/ListUserNotFollowing';

const GET_ALL_USERS = gql`
  query GetUsersAll {
    getAllUsers {
      id
      name
      email
      avatar
    }
  }
`;
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
};
type UserListProps = {
  getAllUsers: User[];
}

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
  padding-bottom: 12px;
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
  color: ${({ $theme }) => $theme === 'dark' ? '#1877F2' : '#1877F2'};
  font-size: 17px;
  padding-top: 5px;

  &:hover {
    color: #006effff
  }
`;
