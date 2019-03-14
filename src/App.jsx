import React, { useEffect } from 'react';

import Main from '@/screens/Main';
import Config from '@/screens/Config';
import Loading from '@/screens/Loading';

import configs from '@/constants/configs';
import { useInitMutation, useRefreshMutation } from '@/apollo';

const schedule = window.require('node-schedule');

const App = () => {
  const [init, { loading }] = useInitMutation();
  const [refreshToken] = useRefreshMutation();

  useEffect(() => {
    if (!configs) {
      return;
    }

    init();

    schedule.scheduleJob('0 0 0 * * *', () => {
      const rToken = localStorage.getItem('refresh_token');
      if (rToken) {
        refreshToken(rToken);
      }
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!configs) {
    return <Config />;
  }

  return (
    <Main />
  );
};

export default App;
