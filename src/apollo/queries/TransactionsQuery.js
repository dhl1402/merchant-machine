import gql from 'graphql-tag';

import TransactionFragment from '../fragments/TransactionFragment';

export default gql`
  query Transactions($offset: Float, $limit: Float) {
    allTransaction(offset: $offset, limit: $limit) {
      offset
      limit
      total
      data {
        ...TransactionFragment
      }
    }
  }
  ${TransactionFragment}
`;
