import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenStore } from '../../store/auth/tokenStore';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { apolloClient } from '../../lib/apolloClient';

import { gql } from '@apollo/client';

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

type MeProps = {
  me: {
    id: string;
    name: string;
    username?: string;
    email: string;
    avatar?: string | null;
    bio?: string;
    coverphoto?: string;
  }
}
export default function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const handleAuth = async () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const token = hash.get('token');

      if (token) {
        TokenStore.set(token);
        window.history.replaceState({}, '', '/');

        try {
          await apolloClient.resetStore();

          const { data } = await apolloClient.query<MeProps>({
            query: ME_QUERY,
            context: {
              headers: {
                authorization: `Bearer ${token}`, 
              },
            },
          });

          if (data?.me) {
            setUser(data.me);
          }

          navigate('/');
        } catch (error) {
          console.error(error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleAuth();
  }, []);

  return <p>Autenticando...</p>;
}