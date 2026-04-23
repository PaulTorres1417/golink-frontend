import { gql } from "@apollo/client";

export const RESET_PASSWORD = gql`
  mutation Reset_Password($password: String!, $token: String!) {
    resetPassword(password: $password, token: $token) {
      message
    }
  }
`;