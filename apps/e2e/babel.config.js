const path = require('path');

const connectors = [
  {name: '@theoplayer/react-native-analytics-adobe', path: '../../adobe'}
];

const alias = connectors.reduce((acc, connector) => {
  acc[connector.name] = path.join(__dirname, connector.path, 'src/index');
  return acc;
}, {});

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          ...alias
        }
      },
    ],
  ],
};
