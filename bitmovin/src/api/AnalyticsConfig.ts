import { SourceMetadata } from './SourceMetadata';
import { CustomData } from './CustomData';

export interface AnalyticsConfig extends CustomData {
  licenseKey: string;
  adTrackingDisabled?: boolean;
  randomizeUserId?: boolean;
  backendUrl?: string;
  cdnProvider?: string;
  customUserId?: string;
  sourceMetadata?: SourceMetadata;
  cookiesEnabled?: boolean;
  cookiesDomain?: string;
  cookiesMaxAge?: number;
}
