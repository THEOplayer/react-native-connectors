import { ComscoreTheo } from './integration/ComscoreTheo';
import { ContentMetadata } from './comscore/ContentMetadata';
import { AdMetadata } from './comscore/AdMetadata';
import {
  ComscoreSkeletonMock,
  ComscoreSkeletonWeb,
} from './comscore/SkeletonApi';

(window as any).THEOplayerComscoreSDK = {
  ComscoreTheo,
  ContentMetadata,
  AdMetadata,
  ComscoreSkeletonMock,
  ComscoreSkeletonWeb,
};
