import gql from 'graphql-tag';

export default gql`
  query Transactions($offset: Float, $limit: Float) {
    allTransaction(offset: $offset, limit: $limit) {
      offset
      limit
      total
      data {
        id
        amount
        fee
        total
      }
    }
  }
`;
