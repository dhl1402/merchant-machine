import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import ApolloLinkTimeout from 'apollo-link-timeout';

import { CONFIG } from '@/constants/configs';

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    new ApolloLinkTimeout(5000),
    setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: localStorage.getItem('access_token'),
      },
    })),
    new HttpLink({
      uri: () => CONFIG.HOST_API,
    }),
  ]),
});
