import { useState } from 'react';
import { useClient } from 'react-apollo';

import RefreshMutation from '../mutations/RefreshMutation';

const defaultOnError = (e) => {
  throw e;
};

export default ({ onCompleted = () => {}, onError = defaultOnError, ...params } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const client = useClient();

  const refreshToken = async (rToken) => {
    try {
      setLoading(true);
      const { access_token, refresh_token } = await client.mutate({
        mutation: RefreshMutation,
        variables: { refresh_token: rToken },
        ...params,
      });
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      onCompleted();
    } catch (e) {
      console.error(e);
      setError(e);
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  return [refreshToken, { loading, error }];
};
