import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { SetContextLink } from '@apollo/client/link/context';
import { useAuthStore } from './store/auth/useAuthStore';
import { RouterProvider } from 'react-router-dom'

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

import { router } from './Router';
import './App.css'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: () => {
      const token = useAuthStore.getState().token;
      return {
        authorization: token ? `Bearer ${token}` : '',
      };
    },
  })
);

const authLink = new SetContextLink((prevContext, _operation) => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, authLink.concat(httpLink)
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getSavedComment: {
            merge(_, incoming) {
              return incoming;
            }
          },
          getSavedPosts: {
            merge(_, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  )
}


