import styled from 'styled-components';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Spinner } from '@components/ui';
import { useTheme } from '@store/theme';
import { ListUserNotFollowing } from '@features/user/ListUserNotFollowing';
import { useNavigate } from 'react-router-dom';

const GET_ALL_USERS = gql`
  query GetUsersAll {
    getAllUsers {
      id
      name
      email
      avatar
      bio
    }
  }
`;
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
};
type UserListProps = {
  getAllUsers: User[];
}

export const Suggestions = () => {
  const { data, error, loading } = useQuery<UserListProps>(GET_ALL_USERS);
  const { theme } = useTheme();
  const navigate = useNavigate();

  if (error) throw new Error('Error fetching users');

  const handleShowMore = () => {
    const users = data?.getAllUsers;
    navigate('/home/not-following', { state: { data: users } });
  }

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
            <ListUserNotFollowing
              key={element.id}
              data={element}
              info={false}
              state={false}
            />
          )))
        }
      </Content>
      <ShowMoreButton
        onClick={handleShowMore}
        $theme={theme}>
        Show more
      </ShowMoreButton>
    </Container>
  )
}

const Container = styled.div<{ $theme: string }>`
  width: 100%;
  height: 300px;
  padding: 22px;
  border-radius: 17px;
  border: 1px solid ${({ $theme }) =>
    $theme === 'dark'
      ? '#6f778b52'
      : '#a8b3cf62'};
`;
const Content = styled.ul`
  width: 100%;
  height: 190px;
  display: flex;
  align-items: center;
  gap: 15px;
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
  cursor: pointer;
  justify-content: flex-start;
  border: none;
  color: ${({ $theme }) => $theme === 'dark' ? '#1877F2' : '#1877F2'};
  font-size: 17px;
  padding-top: 5px;

  &:hover {
    color: #006effff
  }
`;
