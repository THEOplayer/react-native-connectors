import { readFileSync } from 'node:fs';
const { workspaces } = JSON.parse(readFileSync('./package.json', 'utf8'));

/** @type {import('typedoc').TypeDocOptions} */
export default {
  extends: ['./typedoc.base.json'],
  name: 'THEOplayer React Native Connectors',
  entryPoints: workspaces.slice().sort(),
  entryPointStrategy: 'packages',
  includeVersion: false,
  out: 'api',
  hostedBaseUrl: 'https://theoplayer.github.io/react-native-connectors/api/',
};
