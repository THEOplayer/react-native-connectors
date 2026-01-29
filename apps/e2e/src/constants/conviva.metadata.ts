import { ConvivaMetadata } from "@theoplayer/react-native-analytics-conviva";
import Config from 'react-native-config';

export const convivaMetadata: ConvivaMetadata = {
  ['Conviva.applicationName']: 'THEOplayer',
  ['Conviva.viewerId']: Config.CONVIVA_VIEWER_ID,
};
