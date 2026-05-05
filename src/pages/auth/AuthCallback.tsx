import styled from 'styled-components';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenStore } from '../../store/auth/tokenStore';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { apolloClient } from '../../lib/apolloClient';
import { ME_QUERY } from '@/graphql/mutation/user/getUser';
import type { MeProps } from './types';
import { Spinner } from '@/components/ui';

export default function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const handleAuth = async () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const token = hash.get('token');

      if (token) {
        TokenStore.set(token);
        window.history.replaceState({}, '', '/home');

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

          navigate('/home');
        } catch (error) {
          console.error(error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleAuth();
  }, [setUser, navigate]);

  return <Container>
    <Spinner color={'#fff'} />
  </Container>;
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;


