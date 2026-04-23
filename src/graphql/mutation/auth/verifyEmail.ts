import { gql } from "@apollo/client";

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      user {
        id
        name 
        email
        avatar
        bio
        coverphoto
        username
      }
      token
    }
  }
`;