const { app, BrowserWindow, globalShortcut } = require('electron');
const fs = require('fs');
const url = require('url');

const path = require('path');
const isDev = require('electron-is-dev');

const { CONFIG_SAVE_PATH } = require('../constants/configs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line
  // eslint-disable-line global-require
  app.quit();
}

const registerShortcut = () => {
  // restart and remove config.json
  const key = process.platform === 'darwin' ? 'Ctrl+Cmd+C' : 'Ctrl+Alt+C';
  globalShortcut.register(key, () => {
    if (fs.existsSync(CONFIG_SAVE_PATH)) {
      fs.unlinkSync(CONFIG_SAVE_PATH);
    }
    app.relaunch();
    app.quit(0);
  });
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: `${__dirname}/..build/index.html`,
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  registerShortcut();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
