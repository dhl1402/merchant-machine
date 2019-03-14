const os = process.browser ? window.require('os') : require('os');
const path = process.browser ? window.require('path') : require('path');

export const CONFIG_SAVE_PATH = path.join(os.homedir(), '.aCheckin', 'config.json');

const getConfigs = () => {
  try {
    return window.require(CONFIG_SAVE_PATH);
  } catch (e) {
    return null;
  }
};

export default getConfigs();
