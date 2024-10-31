const path = require('path');
const pak_engage = require('../../engage/package.json');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          [pak_engage.name]: path.join(__dirname, '../../engage', pak_engage.source),
        },
      },
    ],
  ],
};
