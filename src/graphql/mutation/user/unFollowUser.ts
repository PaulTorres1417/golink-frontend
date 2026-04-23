import { gql } from "@apollo/client";

export const UNFOLLOW_USER = gql`
  mutation UnFollow_User($userId: ID!) {
    unFollowUser(userId: $userId)
  }
`;