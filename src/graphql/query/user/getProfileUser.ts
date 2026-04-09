import { gql } from "@apollo/client";

export const PROFILE_USER = gql`
  query Profile_User($id: ID!) {
    profileByUser(id: $id) {
      id
      name
      email
      avatar
      coverphoto
      bio
    }
  }
`;