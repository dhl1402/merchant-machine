import gql from 'graphql-tag';

export default gql`
  fragment TransactionFragment on Transaction {
    id
    fee
    total
    date
    status
    products {
      id
      name
      price
      quantity
    }
    staff {
      id
      name
      avatar
    }
  }
`;
