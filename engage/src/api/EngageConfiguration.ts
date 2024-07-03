export interface EngageConfiguration {
  /**
   * Whether a Sign-In card should be published for non-personalized content.
   *
   * For Android Engage SDK, this means a Sign-In card along with the non-personalized content is published,
   * in order to encourage users to sign in to the developer app.
   *
   * @default `false`
   */
  shouldPublishSignInCard?: boolean;

  /**
   * The title used for a recommendation cluster.
   *
   * @default `"Because you enjoyed"`
   */
  recommendationTitle?: string;

  /**
   * Whether to log debug information.
   *
   * @default `false`
   */
  debug?: boolean;
}
