import { gql } from '@apollo/client';

export interface LoginData {
  login: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      bio?: string;
      coverphoto?: string;
      username: string;
    }
    token: string;
  }
}
export interface LoginVariable {
  email: string;
  password: string;
}

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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