import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import ApolloLinkTimeout from 'apollo-link-timeout';

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    new ApolloLinkTimeout(5000),
    new HttpLink({
      uri: 'https://viettd2.dev.acheckin.vn/api/graphql/machine',
    }),
  ]),
});
