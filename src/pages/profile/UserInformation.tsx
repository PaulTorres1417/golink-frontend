import styled from "styled-components";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useTheme } from "@/store/theme";
import { Spinner } from "@components/ui";

const GET_USER_POST_COUNT = gql`
  query count_Posts_By_User($userId: ID!) {
    countPostsByUser(userId: $userId)
  }`;

const MY_FOLLOWING = gql`
  query My_Following($userId: ID!){
    myFollowings(userId: $userId)
  }`;

const MY_FOLLOWERS = gql`
  query My_Followers($userId: ID!) {
    myFollowers(userId: $userId)
  }`;

type CountPostByUser = {
  countPostsByUser: number;
}
type InformationProps = {
  id?: string | null;
}

export const UserInformation = ({ id }: InformationProps) => {
  const { theme } = useTheme();
  const {
    data: dataPostCount,
    loading: postLoading,
    error: postError,
  } = useQuery<CountPostByUser>(GET_USER_POST_COUNT, {
    variables: { userId: id },
    skip: !id
  });
  const {
    data: followingData,
    loading: followingLoading,
    error: followingError,
  } = useQuery<{ myFollowings: number }>(MY_FOLLOWING, { 
    variables: { userId: id },
    skip: !id
  });
  const {
    data: followersData,
    loading: followersLoading,
    error: followersError,
  } = useQuery<{ myFollowers: number }>(MY_FOLLOWERS, { 
    variables: { userId: id },
    skip: !id
  });

  if (!id) return null;
  if (postLoading || followingLoading || followersLoading) {
    return <Loading><Spinner /></Loading>
  }

  if (postError || followingError || followersError) {
    throw new Error('error peticion')
  }

  return (

      <Stats $useTheme={theme}>
        <Stat>
          <strong>{dataPostCount ? dataPostCount.countPostsByUser : 0}</strong>
          <span>Posts</span>
        </Stat>
        <Stat>
          <strong>{followersData?.myFollowers ?? 0}</strong>
          <span>Seguidores</span>
        </Stat>
        <Stat>
          <strong>{followingData?.myFollowings ?? 0}</strong>
          <span>Siguiendo</span>
        </Stat>
      </Stats>
  );
};

const Stats = styled.div<{ $useTheme: string }>`
  display: flex;
  gap: 20px;
  margin-top: 12px;
  color: ${({ $useTheme }) => $useTheme === "dark" ? "#94a3b8" : "#576d8bff"};
`;

const Stat = styled.div`
  display: flex;
  gap: 6px;
  font-size: 14px;
  strong {
    font-weight: 600;
  }
`;

const Loading = styled.div`
  width: 100%;
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;