import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';

import { Main, Config, Loading } from '@/screens';

import { CONFIG } from '@/constants/configs';
import * as APP_STATE from '@/constants/appState';
import { useInitMutation, useRefreshMutation } from '@/apollo';

const packageJson = require('../package.json');

const schedule = window.require('node-schedule');
const { ipcRenderer } = window.require('electron');
const { app } = window.require('electron').remote;

const App = () => {
  const socket = useRef();
  const appState = useRef(APP_STATE.IDLE);
  const nextVersion = useRef(null);
  const sendInfoInterval = useRef();
  const [init, { loading }] = useInitMutation();
  const [refreshToken] = useRefreshMutation();

  const sendAppInfo = (info = {}) => {
    const appMetrics = app.getAppMetrics();
    socket.current.emit('machine_info', {
      appVersion: packageJson.version,
      new_machine_version: nextVersion,
      appUpdateState: appState,
      metrics: appMetrics.map((metric) => {
        return {
          type: metric.type,
          cpuUsage: metric.cpu.percentCPUUsage,
          memorySize: metric.memory ? metric.memory.workingSetSize : 0,
        };
      }),
      ...info,
    });
  };

  useEffect(() => {
    if (!CONFIG) {
      return;
    }

    init();

    schedule.scheduleJob('0 0 0 * * *', () => {
      const rToken = localStorage.getItem('refresh_token');
      if (rToken) {
        refreshToken(rToken);
      }
    });

    socket.current = io(CONFIG.HOST_SOCKET, {
      path: CONFIG.PATH_SOCKET,
      query: `access_token=${localStorage.getItem('access_token')}`,
      forceNew: true,
      timeout: 5000,
    });

    socket.current.on('connect', () => {
      clearInterval(sendInfoInterval.current);
      sendInfoInterval.current = setInterval(() => sendAppInfo, 10000);
    });

    socket.current.on('confirm_transaction', d => console.log(d));

    socket.current.on('check-update', () => {
      ipcRenderer.send('check-update');
    });

    socket.current.on('relaunch', () => {
      app.relaunch();
      app.quit(0);
    });

    socket.current.on('quit', () => {
      app.quit(0);
    });

    ipcRenderer.on('checking-for-update', () => {
      appState.current = APP_STATE.CHECKING_FOR_UPDATE;
      sendAppInfo();
    });

    ipcRenderer.on('update-available', () => {
      appState.current = APP_STATE.UPDATE_AVAILABLE;
      sendAppInfo();
    });

    ipcRenderer.on('update-not-available', () => {
      appState.current = APP_STATE.UPDATE_NOT_AVAILABLE;
      sendAppInfo();
    });

    ipcRenderer.on('download-progress', () => {
      appState.current = APP_STATE.UPDATE_DOWNLOADING;
      sendAppInfo();
    });

    ipcRenderer.on('update-downloaded', () => {
      appState.current = APP_STATE.UPDATE_DOWNLOADED;
      sendAppInfo();
    });

    ipcRenderer.on('update_error', () => {
      appState.current = APP_STATE.UPDATE_ERROR;
      sendAppInfo();
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!CONFIG) {
    return <Config />;
  }

  return (
    <Main />
  );
};

export default App;
