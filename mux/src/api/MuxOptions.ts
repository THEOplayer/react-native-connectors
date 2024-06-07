import type { MuxData } from './MuxData';

export interface MuxOptions {
  debug?: boolean;

  /**
   * By default, Mux plugins for HTML5-based players use a cookie to track playback across subsequent page views.
   * This cookie includes information about the tracking of the viewer, such as an anonymized viewer ID that Mux
   * generates for each user. None of this information is personally-identifiable, but you can disable the use of
   * this cookie if desired. For instance, if your site or application is targeted towards children under 13, you
   * should disable the use of cookies.
   *
   * @remark: Only applicable to Web platforms.
   */
  disableCookies?: boolean;

  /**
   * By default, Mux THEOplayer does not respect Do Not Track when set within browsers. This can be enabled
   * in the options passed to Mux, via a setting named respectDoNotTrack. The default for this is false. If you would
   * like to change this behavior, pass respectDoNotTrack: true.
   *
   * @remark: Only applicable to Web platforms.
   */
  respectDoNotTrack?: boolean;

  /**
   * In the case that you want full control over what errors are counted as fatal or not, you may want to consider
   * turning off Mux's automatic error tracking completely.
   *
   * @remark: Only applicable to Web and Android.
   */
  automaticErrorTracking?: boolean;

  /**
   * Mandatory object with metadata.
   */
  data: MuxData;
}
