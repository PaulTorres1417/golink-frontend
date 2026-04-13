import { ApolloProvider } from '@apollo/client/react';
import { RouterProvider } from 'react-router-dom';
import { apolloClient } from './lib/apolloClient';
import { router } from './Router';
import './App.css';

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  );
}