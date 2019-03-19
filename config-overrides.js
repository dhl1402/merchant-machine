/* eslint-disable no-param-reassign, import/no-extraneous-dependencies */
const path = require('path');
const { override, addWebpackAlias, addBabelPlugins } = require('customize-cra');

module.exports = override(
  addWebpackAlias({ '@': path.resolve(__dirname, 'src') }),
  addBabelPlugins('emotion'),
);
