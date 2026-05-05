import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, Observable } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { TokenStore } from '@/store/auth/tokenStore';
import { silentRefresh } from './auth';

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL,
  credentials: 'include',
});

const wsClient = createClient({
  url: import.meta.env.VITE_WS_URL,
  connectionParams: () => {
    const token = TokenStore.get();
    return { authorization: token ? `Bearer ${token}` : '' };
  },
  shouldRetry: () => true,
  retryAttempts: 5,
});

const wsLink = new GraphQLWsLink(wsClient);

const authLink = new SetContextLink((prevContext) => {
  const token = TokenStore.get();
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

let refreshPromise: Promise<string | null> | null = null;

async function getRefreshedToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = silentRefresh()
    .then((newToken) => {
      if (newToken) {
        wsClient.terminate();
      }
      return newToken;
    })
    .catch(() => null)
    .finally(() => { refreshPromise = null; });

  return refreshPromise;
}

const errorLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const sub = forward(operation).subscribe({
      next: (result) => {
        const isUnauthorized = result.errors?.some(e =>
          e.message.includes('No autorizado') ||
          e.message.toLowerCase().includes('unauthorized') ||
          e.message.includes('TOKEN_EXPIRED')
        );

        if (isUnauthorized) {
          getRefreshedToken()
            .then((newToken) => {
              if (!newToken) {
                window.location.href = '/';
                return;
              }
              TokenStore.set(newToken);
              operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
                headers: {
                  ...headers,
                  authorization: `Bearer ${newToken}`,
                },
              }));
              forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            })
            .catch(() => {
              window.location.href = '/';
            });
        } else {
          observer.next(result);
          observer.complete();
        }
      },
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    });

    return () => sub.unsubscribe();
  });
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