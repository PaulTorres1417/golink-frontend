import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, Observable } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { TokenStore } from '@/store/auth/tokenStore';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: () => {
      const token = TokenStore.get();
      return {
        authorization: token ? `Bearer ${token}` : '',
      };
    },
  })
);

const authLink = new SetContextLink((prevContext, _operation) => {
  const token = TokenStore.get();
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (error && 'statusCode' in error && (error as any).statusCode === 401) {
    return new Observable((observer) => {
      // importación dinámica para evitar dependencia circular
      import('./auth').then(({ silentRefresh }) => {
        silentRefresh()
          .then((newToken) => {
            if (!newToken) {
              window.location.href = '/login';
              return;
            }
            operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
              headers: {
                ...headers,
                authorization: `Bearer ${newToken}`,
              },
            }));
            forward(operation).subscribe(observer);
          })
          .catch(() => {
            window.location.href = '/login';
          });
      });
    });
  }
  return undefined;
});

const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  ApolloLink.from([errorLink, authLink, httpLink])
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getSavedComment: {
            merge(_, incoming) { return incoming; },
          },
          getSavedPosts: {
            merge(_, incoming) { return incoming; },
          },
        },
      },
    },
  }),
});