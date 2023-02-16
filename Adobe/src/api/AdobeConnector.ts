// import {ACPMedia} from '@adobe/react-native-acpmedia';
import type { THEOplayer } from "react-native-theoplayer";
import {ACPCore} from '@adobe/react-native-acpcore';

export class AdobeConnector {
  constructor(_player: THEOplayer) {
    // ACPMedia.extensionVersion().then((version: string) => console.log("AdobeExperienceSDK: ACPMedia version: " + version));
    ACPCore.extensionVersion().then(version => console.log("AdobeExperienceSDK: ACPCore version: " + version));
  }
}
