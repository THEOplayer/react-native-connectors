// import {ACPMedia} from '@adobe/react-native-acpmedia';
import type { THEOplayer } from "react-native-theoplayer";
// @ts-ignore
import { ACPCore } from '@adobe/react-native-acpcore';

export class AdobeConnector {
  constructor(_player: THEOplayer) {
    ACPCore.extensionVersion().then((version: string) => console.log("AdobeExperienceSDK: ACPCore version: " + version));
  }
}
