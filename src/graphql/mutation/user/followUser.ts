import { gql } from "@apollo/client";

export const FOLLOW_USER = gql`
  mutation Follow_User($userId: ID!) {
    followUser(userId: $userId)
  }
`;