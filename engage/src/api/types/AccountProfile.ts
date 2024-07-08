/**
 * To allow a personalized continue watching experience, you need to provide account and profile information.
 */
export interface AccountProfile {
  /**
   * A unique identifier that represents the user's account within your application.
   * This can be the actual account ID or an appropriately obfuscated version.
   */
  accountId: string;

  /**
   * If your application supports multiple profiles within a single account, provide a unique identifier for the
   * specific user profile (real or obfuscated).
   */
  profileId?: string;
}
