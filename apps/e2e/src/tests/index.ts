import Adobe from './Adobe.spec';
import AdobeNative from './AdobeNative.spec';
import AdobeEdge from './AdobeEdge.spec';
import AdobeEdgeNative from './AdobeEdgeNative.spec';
import Comscore from './Comscore.spec';
import Conviva from './Conviva.spec';
import Nielsen from './Nielsen.spec';
import Yospace from './Yospace.spec';
import { Platform } from 'react-native';

const tests = [Adobe, AdobeNative, AdobeEdge, AdobeEdgeNative, Comscore, Conviva, Nielsen];
if (Platform.OS === 'android') {
  tests.push(Yospace);
}

export default tests;
