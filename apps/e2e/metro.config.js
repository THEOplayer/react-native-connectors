const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const root = path.resolve(__dirname, '../..');

const packages = [
  'react',
  'react-native',
  'react-native-theoplayer',
  '@babel/runtime'
];

const connectors = [
  'adobe',
  'adobe-edge',
  'adscript',
  'agama',
  'bitmovin',
  'comscore',
  'conviva',
  'drm',
  'gemius',
  'mux',
  'nielsen',
  'yospace',
  'youbora',
]

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  projectRoot: __dirname,
  watchFolders: [
	path.resolve(root, 'node_modules'),
    ...connectors.map(cn => path.resolve(root, cn)),
  ],
  resolver: {
    /**
     * Metro does not resolve dependencies across multiple node_modules folders by default.
     * Explicitly mapping packages in extraNodeModules ensures all dependencies resolve to the correct versions,
     * avoids duplication, and prevents issues like multiple React instances or module not found errors.
     */
    extraNodeModules: {
      ...Object.fromEntries(packages.map((pkg) => [pkg, path.join(__dirname, 'node_modules', pkg)])),
      ...Object.fromEntries(connectors.map((cn) => [`@theoplayer/react-native-analytics-${cn}`, path.join(root, cn)])),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
