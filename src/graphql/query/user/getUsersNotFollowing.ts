import { gql } from '@apollo/client';

export const GET_USERS_NOT_FOLLOWING = gql`
  query GetUsersNotFollowing {
    getUsersNotFollowing {
      id
      name
      email
      avatar
      bio
    }
  }
`;