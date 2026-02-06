/**
 * The customData fields can be freely configured. The data sent through these fields can be used as a filter or as a breakdown to segment the data
 * according to your needs.
 * Common use-cases for customData are sending the app version used, a cross-domain or profile ID, to track viewers across different platforms, or
 * assigning a high-level content category to order content assets. But the options are more or less unlimited.
 *
 * In the dashboard, under the license settings, customData fields can be labeled according to your liking.
 *
 * Note: For customData field queries we allow a cardinality of maximum of 15,000 distinct values per customData field within the selected time-frame.
 * Each customData field has a limit of 160 characters and there are 5 customData Fields available for every subscription.
 * Additional customData fields can be activated, up to 50 in total. These additional fields may incur a cost depending on the type of data stored.
 * Please reach out to us via the support form in the dashboard if you'd like more information.
 *
 * @example
 * ```ts
 *  const customData: CustomData = {
 *   customData1: 'customData1 value',
 *   customData2: 'customData2 value',
 *  };
 * ```
 *
 * {@link https://developer.bitmovin.com/playback/docs/configuration-analytics}
 */
export interface CustomData {
  /**
   * The customData fields using 1-based indexing, e.g. customData1, customData2, ..., customData50.
   */
  [key: `customData${number}`]: string | undefined;

  /**
   * For testing purposes, Bitmovin Analytics provides an Experiment field to differentiate between testing groups.
   * A popular application for this data field is to use it for testing a new player version, before rolling it out to all your viewers.
   * {@link https://developer.bitmovin.com/playback/docs/configuration-analytics#optional-metadata-fields}
   */
  experimentName?: string;
}
