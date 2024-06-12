import type { AnalyticsDescription } from 'react-native-theoplayer';

/**
 * The stream type, represented by a value from the following list:
 * <br/> - `'live'`
 * <br/> - `'vod'`
 *
 * @public
 */
export type AgamaStreamType = 'live' | 'vod';

/**
 * The service name, represented by a value from the following list:
 * <br/> - `'live'`
 * <br/> - `'svod'`
 * <br/> - `'nvod'`
 * <br/> - `'tvod'`
 * <br/> - `'avod'`
 * <br/> - `'catchuptv'`
 *
 * @public
 */
export type AgamaServiceName = 'live' | 'svod' | 'nvod' | 'tvod' | 'avod' | 'catchuptv';

/**
 * The integration identifier of an analytics description.
 *
 * @public
 */
export type AgamaAnalyticsIntegrationID = 'agama';

/**
 * Describes the configuration of Agama for this source.
 *
 * @public
 */
export interface AgamaSourceConfiguration extends AnalyticsDescription {
  /**
   * The identifier of the analytics integration.
   */
  integration: AgamaAnalyticsIntegrationID;

  /**
   * The identifier of the asset.
   */
  asset: string;

  /**
   * The stream type of the session.
   */
  streamType: AgamaStreamType;

  /**
   * The service name.
   *
   * @remarks
   * <br/> - Will not be reported to Agama if not present
   */
  serviceName?: AgamaServiceName;

  /**
   * The CDN from which the content is served.
   *
   * @remarks
   * <br/> - Will not be reported to Agama if not present
   */
  cdn?: string;

  /**
   * The title of the content.
   *
   * @remarks
   * <br/> - Will not be reported to Agama if not present
   * <br/> - The format is `title` or `title/season` or `title/season/episode` (e.g. Game of Thrones/Season 4/Episode 7)
   */
  contentTitle?: string;

  /**
   * The type of the content.
   *
   * @remarks
   * <br/> - Will not be reported to Agama if not present
   * <br/> - Suggested values are 'trailer', 'movie', 'news', 'documentary', ...
   */
  contentType?: string;

  /**
   * The description of the content.
   *
   * @remarks
   * <br/> - Will not be reported to Agama if not present
   */
  contentDescription?: string;
}
