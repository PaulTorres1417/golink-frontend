import styled from 'styled-components';
import { useTheme } from '@store/theme';
import { useQuery } from '@apollo/client/react';
import { GET_FOLLOWING } from '@/graphql/query/user/getFollowing';
import { ListUserNotFollowing } from '@/components/features/user';
import { Spinner } from '@/components/ui';

type GetFollowingprops = {
  getFollowing: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    bio?: string | null;
  }[];
}
export const Following = () => {
  const { theme } = useTheme();
  const { data, loading, error } = useQuery<GetFollowingprops>(GET_FOLLOWING);

  const users = data?.getFollowing ?? [];

  if (error) return <p>Error: {error.message}</p>

  return (
    <Container $theme={theme}>
      {
        loading ? (
          <ContainerLoading>
            <Spinner />
          </ContainerLoading>
        ) : (
          <>
            <Header>
              <h2>Users followed</h2>
            </Header>
            <Content>
              {
                users.map(user => (
                  <ListUserNotFollowing
                    key={user.id}
                    data={user}
                    info={true}
                    state={true}
                  />
                ))
              }
            </Content>
          </>
        )
      }
    </Container>
  )
}

const Container = styled.div<{ $theme: string }>`
    width: 100%;
    height: 300px;
    padding: 20px;
    border-radius: 17px;
  `;
const Content = styled.ul`
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    gap: 15px;
    flex-direction: column;
    list-style: none;
  `;

const Header = styled.div`
    width: 100%;
    padding-bottom: 20px;
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