export interface Entitlement {
  /**
   * Required identifier string for this entitlement. This must match one of the entitlement identifiers provided in
   * the media provider’s feed published to Google TV. For example,
   * example.com:131d54bc3d714a5aa2adee6ec9533a3d and example.tv:free are all valid entitlement identifiers.
   */
  id: string;

  /**
   * The name is auxiliary information and is used for entitlement matching. While optional, providing a
   * human-readable entitlement name enhances understanding of user entitlements for both developers and support teams.
   * For example: Sling Orange.
   */
  name?: string;

  /**
   * You can optionally specify the expiration time in milliseconds for this entitlement, if it differs from the
   * subscription expiration time. When this field is not set, we assume that the entitlement will expire at the same
   * time the subscription expires.
   */
  expirationTime?: number;
}
