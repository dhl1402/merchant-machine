const { ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

log.transports.file.level = 'debug';
autoUpdater.logger = log;

module.exports = (mainWindow) => {
  ipcMain.on('check-update', () => {
    autoUpdater.checkForUpdates();
  });

  autoUpdater.on('checking-for-update', (data) => {
    mainWindow.webContents.send('checking-for-update', data);
  });

  autoUpdater.on('update-available', (data) => {
    mainWindow.webContents.send('update-available', data);
  });

  autoUpdater.on('update-not-available', (data) => {
    mainWindow.webContents.send('update-not-available', data);
  });

  autoUpdater.on('download-progress', (data) => {
    mainWindow.webContents.send('download-progress', data);
  });

  autoUpdater.on('update-downloaded', (data) => {
    mainWindow.webContents.send('update-downloaded', data);
  });

  autoUpdater.on('error', (data) => {
    mainWindow.webContents.send('update_error', data);
  });
};
