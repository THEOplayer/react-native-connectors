import Adobe from './Adobe.spec';
import AdobeNative from './AdobeNative.spec';
import AdobeEdge from './AdobeEdge.spec';
import Comscore from './Comscore.spec';
import Conviva from './Conviva.spec';
import Nielsen from './Nielsen.spec';
import Yospace from './Yospace.spec';
import { Platform } from 'react-native';

const tests = Platform.OS === 'ios' ? [Adobe, AdobeNative, Comscore, Conviva, Nielsen] :
  [Adobe, AdobeNative, AdobeEdge, Comscore, Conviva, Nielsen];

if (Platform.OS === 'android') {
  tests.push(Yospace);
}

export default tests;
