import { ApolloProvider } from '@apollo/client/react';
import { RouterProvider } from 'react-router-dom';
import { apolloClient } from './lib/apolloClient';
import { router } from './Router';
import './App.css';
import { useTokenRefresh } from './hooks/auth/useSilentRefresh';

export default function App() {
  useTokenRefresh()
  
  return (
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  );
}