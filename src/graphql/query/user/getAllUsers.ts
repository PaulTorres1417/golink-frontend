import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetUsersAll {
    getAllUsers {
      id
      name
      email
      avatar
    }
  }
`;