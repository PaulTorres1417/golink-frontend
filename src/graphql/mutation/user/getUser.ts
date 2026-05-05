import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      username
      email
      avatar
      bio
      coverphoto
    }
  }
`;