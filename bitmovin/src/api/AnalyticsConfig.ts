import { SourceMetadata } from './SourceMetadata';

export enum RetryPolicy {
  SHORT_TERM = 'SHORT_TERM',
  LONG_TERM = 'LONG_TERM',
  NO_RETRY = 'NO_RETRY',
}

export interface AnalyticsConfig {
  /**
   * Your Bitmovin Analytics license key.
   */
  licenseKey: string;

  /**
   * Configuration to specify retry behaviour when samples cannot be sent to the backend.
   * This also allows to enable offline tracking of analytics events.
   *
   * @defaultValue `NO_RETRY`
   */
  retryPolicy?: RetryPolicy;

  /**
   * Flag to disable ClientSide Ad tracking. It doesn't affect server side ads.
   *
   * @platform ios, android
   * @defaultValue `false`
   */
  adTrackingDisabled?: boolean;

  /**
   * Flag to enable ServerSide Ad Engagement tracking (quartile info).
   * This is a premium feature and also needs to be requested through the account.
   * SSAI Audience Info is not affected by this.
   *
   * @platform ios, android
   * @defaultValue `false`
   */
  ssaiEngagementTrackingEnabled?: boolean;

  /**
   * If false we use a device specific value in our data. This value is either retrieved from the system itself and is the same all the time or
   * saved as a random UUID on the system. This allows you to connect sessions happening on the same device.
   * If true we use a randomly generated UUID on every session. If users of your platform don't want to be tracked we recommend to set this to true.
   *
   * @platform ios, android
   * @defaultValue `false`
   */
  randomizeUserId?: boolean;

  /**
   * Optional backend URL to send the analytics data to.
   */
  backendUrl?: string;

  /**
   * Log level for the analytics SDK.
   *
   * @defaultValue 'ERROR'
   */
  logLevel?: 'DEBUG' | 'ERROR';

  /**
   * Initial source metadata to be associated with the playback session.
   */
  sourceMetadata?: SourceMetadata;
}
