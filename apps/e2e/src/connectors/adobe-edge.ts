import { AdobeEdgeConfig, useAdobe as useAdobeEdge } from '@theoplayer/react-native-analytics-adobe-edge';
import Config from 'react-native-config';

const adobeEdgeConfig: AdobeEdgeConfig = {
  mobile: {
    environmentId: Config.ADOBE_EDGE_MOBILE_ENV_ID,
    debugEnabled: true,
  },
  web: {
    datastreamId: Config.ADOBE_EDGE_WEB_DATASTREAM_ID,
    orgId: Config.ADOBE_EDGE_WEB_ORG_ID,
    edgeBasePath: Config.ADOBE_EDGE_WEB_BASE_PATH,
  },
};

export function useAdobeEdgeConnector() {
  const [adobeEdge, initAdobeEdge] = useAdobeEdge(adobeEdgeConfig);
  return { adobeEdge, initAdobeEdge };
}
