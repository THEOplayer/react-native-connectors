/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const os = require('os');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const workspaceDirectory = path.resolve(__dirname, '../../..');
const appDirectory = path.resolve(__dirname, '..');

// Resolve theoplayer from the app itself: the app can hoist a different version
// than the workspace root, and its worker files must match the bundled player.
const theoplayerDirectory = path.dirname(require.resolve('theoplayer/package.json', { paths: [appDirectory] }));

// A folder for any stub components we need in case there is no counterpart for it on react-native-web.
const stubDirectory = path.resolve(appDirectory, './web/stub/');

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.resolve(appDirectory, './web/public/index.html'),
  filename: 'index.html',
  inject: 'body',
});

// THEOplayer's libraryLocation.
const libraryLocation = 'theoplayer';

// Webpack's output location
const outputLocation = 'dist';

// Prepare env keys. The .env file is optional: connector credentials are only
// needed to talk to real back-ends, not to build or to run the e2e suite.
const envPath = path.resolve(appDirectory, '.env');
const env = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {};
const envKeys = {
  GLOBAL_ENV: `{${Object.entries(env)
    .map(([key, value]) => `${JSON.stringify(key)}:${JSON.stringify(value)}`)
    .join(',')}}`,
};

const CopyWebpackPluginConfig = new CopyWebpackPlugin({
  patterns: [
    {
      // Copy transmuxer worker files.
      // THEOplayer will find them by setting `libraryLocation` in the playerConfiguration.
      from: path.resolve(theoplayerDirectory, './THEOplayer.transmux.*').replace(/\\/g, '/'),
      to: `${libraryLocation}/[name][ext]`,
    },
    {
      // Copy service worker
      // THEOplayer will find them by setting `libraryLocation` in the playerConfiguration.
      from: path.resolve(theoplayerDirectory, './theoplayer.sw.js').replace(/\\/g, '/'),
      to: `${libraryLocation}/[name][ext]`,
    },
    {
      // Copy the iframe helper page, loaded from `libraryLocation`.
      from: path.resolve(theoplayerDirectory, './iframe.html').replace(/\\/g, '/'),
      to: `${libraryLocation}/[name][ext]`,
    },
    {
      // Copy CSS files
      from: path.resolve(appDirectory, './web/public/*.css').replace(/\\/g, '/'),
      to: `[name][ext]`,
    },
  ],
});

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
//
// /\.tsx?$/                : process all tsx files.
// /.*@theoplayer\/.*\.js$/ : process all js files from @theoplayer packages to apply the root import alias. This is only needed for this example.
const babelLoaderConfiguration = {
  test: [/\.tsx?$/, /.*@theoplayer\/.*\.js$/],
  exclude: [/\.d\.ts$/],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      // The 'metro-react-native-babel-preset' preset is recommended to match React Native's packager.
      // Leave import/export statements alone: the web connectors are published as `"type": "module"`
      // packages, so webpack treats their bundles as strict ESM and rewriting them to CommonJS
      // fails at runtime with "exports is not defined".
      presets: [['module:@react-native/babel-preset', { disableImportExportTransform: true }]],
      // Re-write paths to import only the modules needed by the app
      plugins: ['react-native-web'],
    },
  },
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'react-native-web-image-loader',
  },
};

module.exports = {
  entry: [
    // load any web API polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your web-specific entry file
    path.resolve(appDirectory, 'index.web.js'),
  ],

  // configures where the build ends up
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, outputLocation),
  },

  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration],
  },
  resolve: {
    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.tsx'],
    alias: {
      // [pkg.name]: path.resolve(workspaceDirectory, pkg.source),

      'react-native$': 'react-native-web',
      'react-native-url-polyfill': 'url-polyfill',
      'react-native-google-cast': path.resolve(stubDirectory, 'CastButtonStub'),
      'react-native-web': path.resolve(appDirectory, 'node_modules/react-native-web'),
      'react-native-svg': path.resolve(appDirectory, 'node_modules/react-native-svg-web'),
      'react-native-config': path.resolve(stubDirectory, 'Config'),

      // Avoid duplicate react env.
      react: path.resolve(appDirectory, 'node_modules/react'),
    },
  },
  plugins: [HTMLWebpackPluginConfig, CopyWebpackPluginConfig, new NodePolyfillPlugin(), new webpack.DefinePlugin(envKeys)],
  devServer: {
    // Tells dev-server to open the browser after server had been started.
    // With E2E_HEADLESS=true (CI) a headless Chrome is opened instead of the
    // default browser, so the cavynext suite can run without a desktop.
    open:
      process.env.E2E_HEADLESS === 'true'
        ? {
            app: {
              name: process.env.E2E_BROWSER || 'google-chrome',
              arguments: [
                '--headless=new',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--autoplay-policy=no-user-gesture-required',
                '--mute-audio',
                // A dedicated profile, so this run neither joins nor disturbs an
                // already running browser: a second window in an existing
                // instance would report to cavynext as a duplicate app.
                `--user-data-dir=${path.join(os.tmpdir(), 'theoplayer-e2e-web-profile')}`,
              ],
            },
          }
        : true,
    historyApiFallback: true,
    static: [
      {
        directory: path.join(appDirectory, 'web/public'),
      },
    ],
    // Hot reload on source changes
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: false,
      },
    },
  },
};
