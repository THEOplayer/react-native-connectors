const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const root = path.resolve(__dirname, '../..');

// Packages that must always resolve to the app-local node_modules to avoid duplicate instances.
const packages = ['react', 'react-native', 'react-native-theoplayer', '@babel/runtime', 'theoplayer'];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Block these packages from being resolved out of root/node_modules.
// They are already explicitly mapped to the app-local copies via extraNodeModules.
const rootNodeModulesBlockList = packages.map(
  (pkg) => new RegExp(`^${escapeRegExp(path.join(root, 'node_modules', pkg))}(/.*)?$`)
);

const dataConnectors = [
  'drm',
  'yospace',
  'mediakind-ssai'
];

const analyticsConnectors = [
  'adobe',
  'adobe-edge',
  'adscript',
  'agama',
  'bitmovin',
  'comscore',
  'conviva',
  'gemius',
  'mux',
  'nielsen',
  'youbora',
];

const allConnectors = [...dataConnectors, ...analyticsConnectors]

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(root, 'node_modules'), ...allConnectors.map((cn) => path.resolve(root, cn))],
  resolver: {
    /**
     * Metro does not resolve dependencies across multiple node_modules folders by default.
     * Explicitly mapping packages in extraNodeModules ensures all dependencies resolve to the correct versions,
     * avoids duplication, and prevents issues like multiple React instances or module not found errors.
     */
    extraNodeModules: {
      ...Object.fromEntries(packages.map((pkg) => [pkg, path.join(__dirname, 'node_modules', pkg)])),
      ...Object.fromEntries(dataConnectors.map((cn) => [`@theoplayer/react-native-${cn}`, path.join(root, cn)])),
	  ...Object.fromEntries(analyticsConnectors.map((cn) => [`@theoplayer/react-native-analytics-${cn}`, path.join(root, cn)])),
    },
    /**
     * Block critical singleton packages from resolving out of root/node_modules.
     * Even though extraNodeModules maps them to the app-local copies, code inside the connector
     * source files (watched via watchFolders) may still pick up root/node_modules versions.
     * blockList prevents that by making those paths invisible to Metro.
     */
    blockList: rootNodeModulesBlockList,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
