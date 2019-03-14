import { useState } from 'react';
import { useClient } from 'react-apollo';

import DoneTransactionMutation from '../mutations/DoneTransactionMutation';

const defaultOnError = (e) => {
  throw e;
};

export default ({ onCompleted = () => {}, onError = defaultOnError, ...params } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const client = useClient();

  const doneTransaction = async (id) => {
    try {
      setLoading(true);
      await client.mutate({
        mutation: DoneTransactionMutation,
        variables: { id },
        ...params,
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

  return [doneTransaction, { loading, error }];
};
