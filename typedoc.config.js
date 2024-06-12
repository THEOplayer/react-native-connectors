const { workspaces } = require('./package.json');

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
    extends: ['./typedoc.base.json'],
    name: 'THEOplayer React Native Connectors',
    entryPoints: workspaces.slice().sort(),
    entryPointStrategy: 'packages',
    includeVersion: false,
    out: 'api',
    sitemapBaseUrl: 'https://theoplayer.github.io/react-native-theoplayer-analytics/api/'
};
