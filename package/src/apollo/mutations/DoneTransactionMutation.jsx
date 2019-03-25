
import gql from 'graphql-tag';

import TransactionFragment from '../fragments/TransactionFragment';

export default gql`
  mutation DoneTransaction($id: String!) {
    doneTransaction(id: $id) {
      ...TransactionFragment
    }
  }
  ${TransactionFragment}
`;
