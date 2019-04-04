import gql from 'graphql-tag';

import TransactionFragment from '../fragments/TransactionFragment';

export default gql`
  query Transaction($id: String!) {
    transaction(id: $id) {
      ...TransactionFragment
    }
  }
  ${TransactionFragment}
`;
