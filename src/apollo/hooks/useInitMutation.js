import { useState } from 'react';
import { useClient } from 'react-apollo';
import moment from 'moment';

import configs from '@/constants/configs';
import InitMutation from '../mutations/InitMutation';

const nodeMachineId = window.require('node-machine-id');
const crypto = window.require('crypto');

const defaultOnError = (e) => {
  throw e;
};

export default ({ onCompleted = () => {}, onError = defaultOnError, ...params } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const client = useClient();

  const init = async () => {
    try {
      setLoading(true);
      const vars = {
        id: configs.ID,
        machine_id: nodeMachineId.machineIdSync(),
        ts: moment().valueOf(),
      };

      const obj = {};
      Object.keys(vars).sort().forEach((key) => { obj[key] = vars[key]; });
      const args = Object.keys(obj).map((k) => { return obj[k]; });
      const hash = crypto.createHash('sha256').update(args.join('') + configs.SECRET_KEY_MACHINE).digest('hex');
      const { access_token, refresh_token } = await client.mutate({
        mutation: InitMutation,
        variables: { ...vars, hash },
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

  return [init, { loading, error }];
};
