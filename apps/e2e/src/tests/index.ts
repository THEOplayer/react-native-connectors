import Adobe from './Adobe.spec';
import Comscore from './Comscore.spec';
import Conviva from './Conviva.spec';
import Nielsen from './Nielsen.spec';
import Yospace from './Yospace.spec';
import { Platform } from 'react-native';

const tests = [Adobe, Comscore, Conviva, Nielsen];
if (Platform.OS === 'android') {
  tests.push(Yospace);
}

export default tests;
