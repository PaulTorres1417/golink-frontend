import { gql } from '@apollo/client';
import { apolloClient } from './apolloClient';
import { TokenStore } from '../store/auth/tokenStore';
import { useAuthStore } from '../store/auth/useAuthStore';

const ME_QUERY = gql`
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
type meProps = {
  me: {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    bio: string;
    coverphoto: string;
  }
}

export async function silentRefresh(): Promise<string | null> {
  try {
    const res = await fetch('http://localhost:4000/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      useAuthStore.getState().logout();
      return null;
    }

    const { accessToken } = await res.json();
    TokenStore.set(accessToken);

    const { data } = await apolloClient.query<meProps>({
      query: ME_QUERY,
      fetchPolicy: 'network-only'
    });

    if (data?.me) {
      useAuthStore.getState().setUser(data.me);
    }

    return accessToken;
  } catch {
    useAuthStore.getState().logout();
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch('http://localhost:4000/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  TokenStore.clear();
  useAuthStore.getState().logout();
  window.location.href = '/login';
}