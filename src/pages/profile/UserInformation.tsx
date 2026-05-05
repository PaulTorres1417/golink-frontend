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
  info: string | null;
}

export const UserInformation = ({ id, info }: InformationProps) => {
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
        <Information>
        { info && <Bio $useTheme={theme}>{info}</Bio>}
        </Information>
        <Content>
        <Stat>
          <strong>{dataPostCount ? dataPostCount.countPostsByUser : 0}</strong>
          <span>{dataPostCount?.countPostsByUser === 1 ? 'Post' : 'Posts'}</span>
        </Stat>
        <Stat>
          <strong>{followersData?.myFollowers ?? 0}</strong>
          <span>Followers</span>
        </Stat>
        <Stat>
          <strong>{followingData?.myFollowings ?? 0}</strong>
          <span>Following</span>
        </Stat>
        </Content>
      </Stats>
  );
};

const Stats = styled.div<{ $useTheme: string }>`
  display: flex;
  flex-direction: column;
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
const Content = styled.div`
  display: flex;
  width: 100%;
  gap: 15px;
`;
const Information = styled.div`
  width: 100%;
`;

const Loading = styled.div`
  width: 100%;
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Bio = styled.p<{ $useTheme: string }>`
  margin-top: 20px;
  font-size: 15px;
  line-height: 1.4;
  color: ${({ $useTheme }) => $useTheme === 'dark' ? '#9ba6b5b0' : '#444e5ce4'}
`;