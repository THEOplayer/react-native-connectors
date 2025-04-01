const path = require('path');
const pak = require('../package.json');

module.exports = {
  dependencies: {
    'react-native-google-cast': {
      platforms: {
        ios: null, // this will disable autolinking for this package on iOS
      },
    },
    [pak.name]: {
      root: path.join(__dirname, '..'),
    },
  },
};
