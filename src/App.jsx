import React, { useEffect } from 'react';
// import io from 'socket.io-client';

import { Main, Config, Loading } from '@/screens';

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
