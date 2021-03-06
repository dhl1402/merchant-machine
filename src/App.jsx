import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';

import { Main, Config, Loading } from '@/screens';

import configs from '@/constants/configs';
import { useInitMutation, useRefreshMutation } from '@/apollo';

const schedule = window.require('node-schedule');

const App = () => {
  const socket = useRef();
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

    socket.current = io(configs.HOST_SOCKET, {
      path: configs.PATH_SOCKET,
      query: `access_token=${localStorage.getItem('access_token')}`,
      forceNew: true,
      timeout: 5000,
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
