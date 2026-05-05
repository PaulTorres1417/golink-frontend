import styled from "styled-components";
import { GET_USERS_NOT_FOLLOWING } from "@/graphql/query/user/getUsersNotFollowing"
import { useQuery } from "@apollo/client/react"
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui";
import { useTheme } from "@/store";
import { ListUserNotFollowing } from "@/components/features/user";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
}
type Props = {
  getUsersNotFollowing: User[];
}
export default function NotFollowing() {
  const { state } = useLocation();
  const selectUsers = useMemo(() => state?.data ?? [], [state?.data])
  const { data, error, loading } = useQuery<Props>(GET_USERS_NOT_FOLLOWING);
  const { theme } = useTheme();

  const users = useMemo(() => {
    const serverUsers = data?.getUsersNotFollowing ?? [];
    const selectIds = new Set(selectUsers.map((user: User) => user.id))
    return serverUsers.filter(user => !selectIds.has(user.id));
  }, [data, selectUsers])

  if (error) return <h2>{error.message}</h2>

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
              <h2>Suggested for you</h2>
            </Header>
            <Content>
              {
                users.map(user => (
                  <ListUserNotFollowing
                    key={user.id}
                    state={false}
                    data={user}
                    info={true}
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