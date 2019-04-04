import { useState } from 'react';
import { useClient } from 'react-apollo';

import TransactionQuery from '../queries/TransactionQuery';
import TransactionsQuery from '../queries/TransactionsQuery';

const defaultOnError = (e) => {
  throw e;
};

export default ({ onCompleted = () => {}, onError = defaultOnError } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const client = useClient();

  const pollTransaction = async (id, ...params) => {
    try {
      setLoading(true);
      const response = await client.query({
        query: TransactionQuery,
        variables: { id },
        ...params,
      });
      const qVars = { offset: 0, limit: 6 };
      const { allTransaction } = client.readQuery({
        query: TransactionsQuery,
        variables: qVars,
      });
      client.writeQuery({
        query: TransactionsQuery,
        variables: qVars,
        data: {
          allTransaction: {
            ...allTransaction,
            total: allTransaction.total + 1,
            data: [response.data.transaction].concat(allTransaction.data),
          },
        },
      });
      onCompleted();
    } catch (e) {
      console.error(e);
      setError(e);
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  return [pollTransaction, { loading, error }];
};
