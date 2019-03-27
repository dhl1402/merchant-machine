import React from 'react';
import { Button } from 'react-bootstrap';
import * as yup from 'yup';
import classNames from 'classnames';

import { CONFIG_SAVE_PATH } from '@/constants/configs';

import styles from './Config.module.scss';
import logo from '@/static/images/aCheckin-SC.png';

const { app, dialog } = window.require('electron').remote;
const fs = window.require('fs');

const configSchema = yup.object().shape({
  ID: yup.string().required(),
  HOST_API: yup.string().required(),
  HOST_SOCKET: yup.string().required(),
  PATH_SOCKET: yup.string().required(),
  SECRET_KEY_MACHINE: yup.string().required(),
  EXTERNALS: yup.array(),
  DOOR: yup.number().required(),
});

const Config = () => {
  const selectFile = () => {
    dialog.showOpenDialog(
      {
        title: 'Chọn file cấu hình',
        buttonLabel: 'Chọn',
        filters: [{ name: 'JSON', extensions: ['json'] }],
        properties: ['openFile'],
      },
      (files) => {
        try {
          const filePath = (files || [files])[0];
          if (!filePath) {
            return;
          }
          if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
          }
          const configData = window.require(filePath);
          if (!configSchema.isValidSync(configData)) {
            throw new Error('File config invalid');
          }
          fs.writeFileSync(CONFIG_SAVE_PATH, JSON.stringify(configData));
          app.relaunch();
          app.quit(0);
        } catch (e) {
          alert(e.message);
        }
      },
    );
  };

  return (
    <div className={classNames(styles.Config, 'root-layout')}>
      <img className="logo" src={logo} alt="logo" />
      <Button onClick={selectFile}>Vui lòng chọn file cấu hình</Button>
    </div>
  );
};

export default Config;
